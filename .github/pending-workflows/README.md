# Pending workflows

These replace the files of the same name in `.github/workflows/`. The session that
wrote them can't push workflow files (its token has no `workflow` scope), so move
them into place and push from your account:

```bash
git pull
git mv -f .github/pending-workflows/pages.yml .github/workflows/pages.yml
git mv -f .github/pending-workflows/pr-preview.yml .github/workflows/pr-preview.yml
git rm .github/pending-workflows/README.md
git commit -m "Build and publish in one job; drop artifacts"
git push
```
