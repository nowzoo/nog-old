---
title: nog serve
date: 2015/07/20
---

Serves the site locally, rebuilding when changes are made in the `_assets`, `_cfg`, `_content` and `_templates` directories.  

```
Usage: $ nog serve [options]

serve the site locally, rebuilding when changes are made

Options:

  -h, --help         output usage information
  -P, --published    suppress content that has been marked as unpublished
  -p, --port <port>  port for the local webserver
  -v, --verbose      verbose output
```


#### Notes

**Unpublished Content:** By default, the local site will display unpublished content (that is, content where you have set `published: false` in the metadata.) If you want to see the site locally just as it would appear on GitHub, use the `--published` flag.

**Server Port:** Use `--port` or `-p` to change the web server's port from the default (3000). For example: `nog serve -p 3001`.

**LiveReload:** Nog starts a LiveReload server to automatically reload changes into your browser. You need to enable this by [inserting a script in your HTML](https://github.com/livereload/livereload-js) or by installing a browser extension, such as [LiveReload for Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei).
