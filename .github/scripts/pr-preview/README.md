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
- `comment.sh` - collapses earlier preview comments as outdated and posts a new one.
- `calculate-pages-base-url.sh`, `remove-prefix-path.sh` - helpers from upstream.

Workflows: `.github/workflows/pr-preview.yml` (previews) and
`.github/workflows/pages.yml` (production site at the branch root; it keeps
`pr-preview/` intact).

Concurrency checks: `pnpm exec python3 .github/scripts/pr-preview/test-races.py`.
The offline tests force production and preview publishers to push from the same
base, verify that retries preserve both sites, and check that the Pages waiter
accepts a deployed descendant after supersession but rejects unrelated builds.

Production and previews use separate concurrency groups so builds can overlap.
Publishing retries non-fast-forward pushes from a fresh shallow clone. Production
keeps `pr-preview/`; previews replace only their own directory. Deploy and remove
for one PR share a canceling group. Pages itself may supersede deployments, so
the waiter accepts a successfully deployed descendant of the published commit.
