#!/usr/bin/env bash
# Posts a new PR preview comment and collapses the earlier ones, so the latest preview
# link and QR code sit at the bottom of the conversation.
#
# Usage: comment.sh <pr_number> <body_file>
# Required env: GH_TOKEN, GITHUB_REPOSITORY

set -euo pipefail

pr_number=${1:?missing pr_number}
body_file=${2:?missing body_file}
marker="<!-- pr-preview -->"

old_ids=$(gh api --paginate "repos/$GITHUB_REPOSITORY/issues/$pr_number/comments" \
    --jq ".[] | select(.user.login == \"github-actions[bot]\" and (.body | startswith(\"$marker\"))) | .node_id")

gh api "repos/$GITHUB_REPOSITORY/issues/$pr_number/comments" -F "body=@$body_file" --jq .html_url

for id in $old_ids; do
    gh api graphql -f query='mutation($id: ID!) {
      minimizeComment(input: {subjectId: $id, classifier: OUTDATED}) {
        minimizedComment { isMinimized }
      }
    }' -f id="$id" > /dev/null
done
