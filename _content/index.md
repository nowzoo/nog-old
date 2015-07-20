---
title: Home Page
---

# Nog
Nog is a command-line site manager for GitHub Pages.

It strives to be brutally simple.


### Quick Start

First, [fork your own Nog](https://github.com/nowzoo/nog#fork-destination-box).

```
# clone your fork (replace YOUR_USER)...
$ git clone git@github.com:YOUR_USER/nog.git

$ cd nog

# install the dependencies...
$ npm install

# start nog...
$ ./nog serve

```

- Visit your site at <http://localhost:3000/nog/>.
- Make changes in the `\_content`, `\_cfg`, `\_assets` and `\_templates` directories.
- The changes you make will automatically show up on the local site (as long as you've got livereload enabled in the browser.)

When you want to publish your changes to your GitHub Pages site, open up a separate terminal tab and...

```
$ ./nog push
```

To diagnose any problems:

```
$ ./nog lint
```

### Content

There are three types of content:

 - The home page
 - Plain pages
 - Blog posts

By default, any Markdown `.md` or HTML `.html` file in the `_content` directory will be turned into one of these three types. A file at `_content/index.*` will be treated as the home page. Files under the archives directory (by default `_content/posts`) will be treated as blog posts, and archived by date and tag. All other content files are assumed to be pages.

Atomic urls are determined by file path.  The content at `_content/foo.md` will end up having the URL `/foo/`. If the content file is located at `_content/foo/index.html`, then the URL will likewise be `/foo/`.

Note the following rules:

 - Index files take precedence: `help/index.md` will be used and `help.md` will be ignored.
 - By default Markdown files take precedence over HTML files: `help/advanced.md` will be used instead of `help/advanced.html`.

Both pages and posts are hierarchical. For example, the content at `_content/foo/bar.md` will be the child of the content at `_content/foo/index.md`.


#### Content Metadata

Content metadata, such as the title, is defined by inserting an optional YAML front matter section at the top of your content  files. The front matter section consists of:

 - three dashes `---` and a line break
 - some YAML
 - three dashes `---` and a line break

For example, a valid page file in Markdown might look like this:

```
---
title: My Valid Page
excerpt: Who dee woot who dee woo too?
date: '2015/07/19  16:00'
---
# The Actual Content Begins Here
```

By default and design, Nog doesn't care very much or make assumptions about what a page's metadata has or doesn't have. That said, Nog provides the following sensible default values:

 - `title`

 If missing, Nog uses the humanized name of the file. Thus `my-great-page` will result in a title of My great page.

 - `date`

 If missing (or if the value can't be parsed as a Date) this is set to the modified time of the file. You can use any  format parseable by moment.js, but you can't go wrong with `YYYY/MM/DD HH:mm`.

 - `excerpt`

 If missing, Nog uses the first 255 characters of the strip-tagged content, with all consecutive whitespaces converted to a single space character.

 - `template`

 If missing, assumed to be `page.twig` if the content is a plain page, `post.twig` if it's a blog post or `archive.twig` if it's an archive of blog posts. This value should always be relative to the `_templates` directory.

### Site Config
