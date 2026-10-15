#!/usr/bin/env bash
# Replaces the JamesIves/github-pages-deploy-action steps of rossjrw/pr-preview-action
# (MIT, Copyright (c) 2022 Ross Williams).
#
# Shallow-clones the Pages branch, deletes the target directory, copies the new
# files in (deploy) or leaves it deleted (remove), then commits and pushes. A push
# that loses a race with another run is retried on a fresh shallow clone.
#
# Usage: publish.sh deploy <target_dir> <source_dir>
#        publish.sh remove <target_dir>
#
# <target_dir> is relative to the branch root; "." means the root itself, in which
# case every path listed in KEEP is left in place.
#
# Required env: GH_TOKEN, GITHUB_REPOSITORY
# Optional env: REMOTE_URL (overrides the GitHub remote, for testing), PREVIEW_BRANCH (default gh-pages), COMMIT_MESSAGE, KEEP (space-separated),
#               GIT_USER_NAME, GIT_USER_EMAIL
# Outputs ($GITHUB_OUTPUT): deployment_status (success | skipped), deployed_commit_sha

set -euo pipefail

mode="${1:?missing mode (deploy or remove)}"
target="${2:?missing target directory}"
source_dir="${3:-}"
branch="${PREVIEW_BRANCH:-gh-pages}"
keep="${KEEP:-}"
message="${COMMIT_MESSAGE:-Update $target}"

case "$mode" in
    deploy)
        [ -n "$source_dir" ] || { echo >&2 "deploy needs a source directory"; exit 1; }
        source_dir="$(cd "$source_dir" && pwd)"
        ;;
    remove) ;;
    *) echo >&2 "unknown mode $mode"; exit 1 ;;
esac

target="${target#./}"
target="${target%/}"
if [ -z "$target" ] || [ "$target" = "." ]; then
    target="."
else
    case "$target" in
        /* | *..*) echo >&2 "target must be a relative path inside the branch"; exit 1 ;;
    esac
fi

remote="${REMOTE_URL:-https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git}"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

clean_target() {
    if [ "$target" = "." ]; then
        # Delete everything at the root except .git and the kept paths.
        find . -mindepth 1 -maxdepth 1 ! -name .git -print0 | while IFS= read -r -d '' entry; do
            name="${entry#./}"
            for k in $keep; do
                [ "$name" = "${k%/}" ] && continue 2
            done
            rm -rf "$entry"
        done
    else
        rm -rf "$target"
    fi
}

status=""
for attempt in 1 2 3 4 5; do
    rm -rf "$work" && mkdir -p "$work"
    if git ls-remote --exit-code --heads "$remote" "$branch" > /dev/null; then
        git clone --quiet --depth 1 --single-branch --branch "$branch" "$remote" "$work"
    else
        echo >&2 "Branch $branch does not exist yet; creating it"
        git init --quiet -b "$branch" "$work"
        git -C "$work" remote add origin "$remote"
    fi

    pushd "$work" > /dev/null
    git config user.name "${GIT_USER_NAME:-github-actions[bot]}"
    git config user.email "${GIT_USER_EMAIL:-41898282+github-actions[bot]@users.noreply.github.com}"

    clean_target
    if [ "$mode" = "deploy" ]; then
        mkdir -p "$target"
        cp -a "$source_dir/." "$target/"
        # A CNAME only means something at the branch root.
        [ "$target" != "." ] && rm -f "$target/CNAME"
    fi
    # Without this, Pages runs Jekyll, which drops Next's _next/ directory.
    touch .nojekyll

    git add -A
    if git diff --cached --quiet; then
        echo >&2 "Nothing changed; skipping commit"
        status=skipped
        popd > /dev/null
        break
    fi
    git commit --quiet -m "$message"
    if git push --quiet origin "HEAD:refs/heads/$branch"; then
        status=success
        popd > /dev/null
        break
    fi
    popd > /dev/null
    echo >&2 "Push failed (attempt $attempt); retrying on a fresh clone"
    sleep $((attempt * 5))
done

if [ -z "$status" ]; then
    echo >&2 "Could not push to $branch"
    exit 1
fi

sha=$(git ls-remote --heads "$remote" "$branch" | cut -f1)
echo >&2 "Deployment $status; $branch is at $sha"
{
    echo "deployment_status=$status"
    echo "deployed_commit_sha=$sha"
} >> "${GITHUB_OUTPUT:-/dev/null}"
