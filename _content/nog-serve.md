---
title: nog serve
date: 2015/07/20
---

Serves the site locally, rebuilding when changes are made in the `_assets`, `_cfg`, `_content` and `_templates` directories.  

```
$ nog serve
```
#### Notes

By default, the local site will display unpublished content (that is, content where you have set `published: false` in the metadata.) If you want to see the site locally just as it would appear on GitHub, use the `--published` flag.

In addition to a web server, a Live Reload is started to automatically reload changes into the browser. You need to enable this in the browser by [inserting a script in your HTML](https://github.com/livereload/livereload-js) or by installing a browser extension, such as [LiveReload for Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei).

#### Options

Use `--published` or `-P` to build the site locally without displaying content that has been marked as unpublished. 

```
$ nog serve -P
```


Use `--port` or `-p` to change the web server's port from the default (3000).

```
$ nog serve -p 3001
```


Use `--verbose` or `-v`  for verbose output.

```
$ nog serve -v
```
