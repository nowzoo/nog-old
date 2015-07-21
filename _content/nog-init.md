---
title: nog init
date: 2015/07/20
---

Initializes a site in the current working directory with the default content and configuration.

```
$ nog init
```

You should only have to use this command once per site &mdash; all it does is copy the default `_assets`, `_cfg`, `_content` and `_templates` directories to your working directory.

Importantly, if the current directory already contains one or more of those subdirectories, `nog init` will refuse to do anything. If you need to reinitialize the current directory, delete the subdirectories by hand first.

```
# install nog if you haven't already...
$ npm install -g nog

# make a new directory and cd into it...
$ mkdir my-site && cd my-site

# initialize the site...
$ nog init
```

#### Options
Pass `--verbose` or `-v`  for verbose output.

```
$ nog init -v
```
