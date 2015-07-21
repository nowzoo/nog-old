---
title: Nog
date: 2015/07/20
---

Nog is a command-line site manager for GitHub Pages.

It strives to be brutally simple.


### Quick Start


```
# install nog globally...
$ npm install -g nog

# make a directory and cd into it...
$ mkdir my-site && cd my-site

# initialize nog...
$ nog init

# start the server...
$ nog serve
```
- Visit your site at <http://localhost:3000/nog/>.
- Make changes in the `_content`, `_cfg`, `_assets` and `_templates` directories.
- The changes you make will automatically show up on the local site (as long as you've got livereload enabled in the browser.)

When you want to publish your changes to your GitHub Pages site, open up a separate terminal tab and...

```
$ ./nog push
```

To diagnose any problems:

```
$ ./nog lint
```
