---
title: nog push
date: 2015/07/20
---

Builds the site and pushes it to the `gh-pages` branch of your GitHub repository.

```
$ nog push
```

#### Notes:

This command is only concerned with pushing the `gh-pages` branch &mdash; that is, the special branch GitHub Pages use to serve your site. You should manage the other branches (e.g. `master`) directly via `git`.

The command will always build using the contents of currently checked-out branch.

`nog push` creates a temporary directory to create a fresh repository, pull the `gh-pages` branch, build the site and push the changes.  Therefore the built site will not show up in your project directory, and your repository will not have its own `gh-pages` branch.

The command will fail if you have not added a remote named `origin`. If you create a repo on GitHub and clone it this remote will already exist; otherwise you will have to do `git remote add`.


#### Options
Use `--verbose` or `-v`  for verbose output.

```
$ nog push -v
```
