#!/usr/bin/env bash
# Adapted from rossjrw/pr-preview-action lib/generate-comment.sh
# (MIT, Copyright (c) 2022 Ross Williams).
#
# Prints the body of the PR preview comment.
#
# Usage: generate-comment.sh deploy|remove
# Env: PREVIEW_URL, PREVIEW_BRANCH, HEAD_SHA (deploy), QR_CODE_PROVIDER (deploy;
#      "false" disables the QR code), GITHUB_SERVER_URL, GITHUB_REPOSITORY,
#      PAGES_READY ("true" once the Pages build has finished)

set -euo pipefail

deployment_action=${1:?missing deployment_action}
preview_url=${PREVIEW_URL:?missing PREVIEW_URL}
preview_branch=${PREVIEW_BRANCH:-gh-pages}
server_url=${GITHUB_SERVER_URL:-https://github.com}
repo=${GITHUB_REPOSITORY:?missing GITHUB_REPOSITORY}
qr_code_provider=${QR_CODE_PROVIDER:-https://qr.rossjrw.com/?color.dark=0d1117&url=}
time=$(date -u '+%Y-%m-%d %H:%M UTC')

# Lets comment.sh find and replace earlier preview comments.
echo "<!-- pr-preview -->"

if [ "$deployment_action" = "deploy" ]; then
    sha=${HEAD_SHA:?missing HEAD_SHA}
    qr_code=""
    if [ "$qr_code_provider" != "false" ] && [ -n "$qr_code_provider" ]; then
        qr_code="<img src=\"${qr_code_provider}${preview_url}\" height=\"100\" align=\"right\" alt=\"QR code for preview link\">"
    fi
    if [ "${PAGES_READY:-false}" = "true" ]; then
        ready="The preview is live."
    else
        ready="Preview will be ready when the [GitHub Pages deployment](${server_url}/${repo}/deployments) is complete."
    fi

    cat << EOT
PR Preview
:---:
| <p>$qr_code</p> :rocket: View preview at <br> **${preview_url}** <br><br>
| <h6>Commit [\`${sha:0:7}\`](${server_url}/${repo}/commit/${sha}), built to branch [\`${preview_branch}\`](${server_url}/${repo}/tree/${preview_branch}) at ${time}. <br> ${ready} <br> Comment \`ci preview\` to rebuild it. <br><br> </h6>
EOT

elif [ "$deployment_action" = "remove" ]; then
    cat << EOT
PR Preview
:---:
Preview removed because the pull request was closed. Reopen it to deploy it again.
${time}
EOT
fi
