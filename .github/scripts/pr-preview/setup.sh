#!/usr/bin/env bash
# Adapted from rossjrw/pr-preview-action lib/main.sh and lib/determine-auto-action.sh
# (MIT, Copyright (c) 2022 Ross Williams).
#
# Works out what the preview workflow should do and writes it to $GITHUB_OUTPUT:
#   deployment_action  deploy | remove | none
#   reason             why, when the action is none
#   pr_number, head_sha, base_path, preview_file_path, pages_base_url, preview_url
#
# Handles:
#   pull_request   opened / reopened / synchronize -> deploy, closed -> remove
#   pull_request_target  closed -> remove (covers fork PRs, whose own events get a
#                  read-only token; nothing from the PR is checked out)
#   issue_comment  a comment that is exactly "ci preview" on an open PR -> deploy. This
#                  builds the PR's code with this repository's write token, fork PRs
#                  included, so only comment it after reading the PR.
#
# Required env: GITHUB_EVENT_NAME, GITHUB_EVENT_PATH, GITHUB_REPOSITORY, GH_TOKEN
# Optional env: UMBRELLA_DIR (default pr-preview), PAGES_BASE_URL, CNAME_FILE

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/calculate-pages-base-url.sh"
source "$script_dir/remove-prefix-path.sh"

umbrella_dir=$(normalise_path "${UMBRELLA_DIR:-pr-preview}")
pages_base_url="${PAGES_BASE_URL:-}"
deployment_action=none
reason=""
pr_number=""
head_sha=""

case "$GITHUB_EVENT_NAME" in
    pull_request | pull_request_target)
        pr_number=$(jq -r '.pull_request.number' "$GITHUB_EVENT_PATH")
        head_sha=$(jq -r '.pull_request.head.sha' "$GITHUB_EVENT_PATH")
        event_type=$(jq -r '.action' "$GITHUB_EVENT_PATH")
        echo >&2 "event_type is $event_type"
        case "$event_type" in
            opened | reopened | synchronize) deployment_action=deploy ;;
            closed) deployment_action=remove ;;
            *) reason="unhandled pull_request action $event_type" ;;
        esac
        ;;
    issue_comment)
        pr_number=$(jq -r '.issue.number' "$GITHUB_EVENT_PATH")
        # Only an exact "ci preview" (case and surrounding whitespace ignored) counts.
        body=$(jq -r '.comment.body' "$GITHUB_EVENT_PATH" | tr -d '\r' | tr '[:upper:]' '[:lower:]' \
            | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
        if [ "$(jq -r '.issue.pull_request != null' "$GITHUB_EVENT_PATH")" != "true" ]; then
            reason="comment is not on a pull request"
        elif [ "$body" != "ci preview" ]; then
            reason="comment is not a preview command"
        else
            pr_json=$(gh api "repos/$GITHUB_REPOSITORY/pulls/$pr_number")
            if [ "$(echo "$pr_json" | jq -r '.state')" != "open" ]; then
                reason="pull request is closed"
            else
                head_sha=$(echo "$pr_json" | jq -r '.head.sha')
                deployment_action=deploy
            fi
        fi
        ;;
    *)
        reason="unknown event $GITHUB_EVENT_NAME"
        ;;
esac

echo >&2 "deployment_action is $deployment_action${reason:+ ($reason)}"

# A custom domain (CNAME) wins over the guessed <owner>.github.io/<repo> URL.
if [ -z "$pages_base_url" ] && [ -n "${CNAME_FILE:-}" ] && [ -s "$CNAME_FILE" ]; then
    pages_base_url=$(head -n 1 "$CNAME_FILE" | tr -d '[:space:]')
fi
if [ -z "$pages_base_url" ]; then
    pages_base_url=$(calculate_pages_base_url "$GITHUB_REPOSITORY")
fi
pages_base_url=$(normalise_path "$pages_base_url")

preview_file_path="$umbrella_dir/pr-$pr_number"
# A Pages site on <owner>.github.io/<repo> is already served under /<repo>.
case "$pages_base_url" in
    */*) base_path="/${pages_base_url#*/}/$preview_file_path" ;;
    *) base_path="/$preview_file_path" ;;
esac

{
    echo "deployment_action=$deployment_action"
    echo "reason=$reason"
    echo "pr_number=$pr_number"
    echo "head_sha=$head_sha"
    echo "base_path=$base_path"
    echo "preview_file_path=$preview_file_path"
    echo "pages_base_url=$pages_base_url"
    echo "preview_url=https://$pages_base_url/$preview_file_path/"
} | tee -a "${GITHUB_OUTPUT:-/dev/null}"
