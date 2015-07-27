---
title: Nog
date: 2015/07/20
---

Nog is a command-line site manager for GitHub Pages running on Node.js.

It strives to be brutally simple and unopinionated.

#### What Nog Does

 - It parses a set of Markdown and/or HTML files into static website that you can preview locally.
 - It makes it easy to publish that website to GitHub Pages.

#### What Nog Does By Default

- It uses [marked](https://github.com/chjj/marked) to render Markdown.
- It uses [Swig](http://paularmstrong.github.io/swig/) as its default templating engine.

These behaviors are only sensible defaults. If you prefer Jade over Swig as your template engine, for example, it's an easy change.

#### What Nog Doesn't Do

- It doesn't care how you compile CSS or other parts of your build process.


#### Quick Start

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
$ nog push
```

To diagnose any problems:

```
$ nog lint
```
