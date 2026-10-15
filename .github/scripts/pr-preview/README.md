# PR preview scripts

Adapted from [rossjrw/pr-preview-action](https://github.com/rossjrw/pr-preview-action)
(MIT, Copyright (c) 2022 Ross Williams). The scripts are vendored rather than using
the action so the workflow controls how the preview branch is cloned, cleaned, and
commented on.

- `setup.sh` - works out what to do (deploy, remove, none), the PR number and head
  SHA, and the preview URL. Handles `pull_request` events and `ci preview` comments.
- `publish.sh` - shallow-clones the `gh-pages` branch, deletes the target directory,
  copies the new files in (or leaves it deleted), commits, and pushes. Retries on a
  push race. Replaces `JamesIves/github-pages-deploy-action`.
- `wait-for-pages-deployment.sh` - waits for the Pages build of a given commit.
- `generate-comment.sh` - writes the PR comment with the preview link and QR code.
- `comment.sh` - deletes earlier preview comments and posts a new one.
- `calculate-pages-base-url.sh`, `remove-prefix-path.sh` - helpers from upstream.

Workflows: `.github/workflows/pr-preview.yml` (previews) and
`.github/workflows/pages.yml` (production site at the branch root; it keeps
`pr-preview/` intact).
