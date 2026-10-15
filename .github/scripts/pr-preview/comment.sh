#!/usr/bin/env bash
# Posts a new PR preview comment and deletes the earlier ones, so the latest preview
# link and QR code sit at the bottom of the conversation.
#
# Usage: comment.sh <pr_number> <body_file>
# Required env: GH_TOKEN, GITHUB_REPOSITORY

set -euo pipefail

pr_number=${1:?missing pr_number}
body_file=${2:?missing body_file}
marker="<!-- pr-preview -->"

old_ids=$(gh api --paginate "repos/$GITHUB_REPOSITORY/issues/$pr_number/comments" \
    --jq ".[] | select(.user.login == \"github-actions[bot]\" and (.body | startswith(\"$marker\"))) | .id")

gh api "repos/$GITHUB_REPOSITORY/issues/$pr_number/comments" -F "body=@$body_file" --jq .html_url

for id in $old_ids; do
    gh api -X DELETE "repos/$GITHUB_REPOSITORY/issues/comments/$id" > /dev/null || true
done
