#!/usr/bin/env bash
# Adapted from rossjrw/pr-preview-action lib/wait-for-pages-deployment.sh
# (MIT, Copyright (c) 2022 Ross Williams).
# Waits for this commit or a deployed descendant. GitHub Pages may cancel an
# older deployment when another preview or production push supersedes it.
# Usage: wait-for-pages-deployment.sh <owner/repo> <commit_sha> <branch> <token>
set -euo pipefail

repo=${1:?missing repository}
target_sha=${2:?missing commit SHA}
branch=${3:?missing branch}
token=${4:?missing token}
api=${GITHUB_API_URL:-https://api.github.com}
timeout=${PAGES_WAIT_TIMEOUT:-840}

[[ "$target_sha" =~ ^[0-9a-f]{40}$ ]] || { echo >&2 "Expected a 40-character commit SHA"; exit 1; }
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

elapsed=0
while [ "$elapsed" -lt "$timeout" ]; do
    builds=$(curl --fail --silent --show-error \
        -H "Authorization: Bearer $token" \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "$api/repos/$repo/pages/builds?per_page=100")
    # Validate before treating an API error as an empty build list.
    echo "$builds" | jq -e 'type == "array"' > /dev/null
    if echo "$builds" | jq -e --arg sha "$target_sha" \
        'any(.[]; .commit == $sha and .status == "built")' > /dev/null; then
        echo "Pages deployed $target_sha"
        exit 0
    fi

    # Exact builds can be skipped or canceled. A deployed descendant contains our
    # change too, because publish.sh only makes ordinary, non-force pushes.
    if [ "$elapsed" -ge 30 ]; then
        if [ ! -d "$work/repo/.git" ]; then
            git clone --quiet --depth=50 --single-branch --branch="$branch" \
                "https://oauth2:${token}@github.com/${repo}.git" "$work/repo"
        else
            git -C "$work/repo" fetch --quiet --depth=50 origin "$branch"
        fi
        while IFS= read -r candidate; do
            if git -C "$work/repo" merge-base --is-ancestor "$target_sha" "$candidate" 2>/dev/null; then
                echo "Pages deployed $candidate (includes $target_sha)"
                exit 0
            fi
        done < <(echo "$builds" | jq -r '.[] | select(.status == "built") | .commit')
    fi
    echo "Waiting for Pages to deploy $target_sha or a descendant (${elapsed}s)"
    sleep 10
    elapsed=$((elapsed + 10))
done

echo >&2 "Timed out waiting for Pages to deploy $target_sha or a descendant"
exit 1
