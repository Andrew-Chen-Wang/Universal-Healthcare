# Pending workflows

These belong in `.github/workflows/`. The session that wrote them could not push
workflow files (its token has no `workflow` scope), so move them into place and
push from an account that can:

```bash
git mv -f .github/pending-workflows/pages.yml .github/workflows/pages.yml
git mv .github/pending-workflows/pr-preview.yml .github/workflows/pr-preview.yml
git rm .github/pending-workflows/README.md
git commit -m "Move PR preview workflows into place"
git push
```

Then set Settings > Pages > Source to "Deploy from a branch", `gh-pages`, `/ (root)`.
