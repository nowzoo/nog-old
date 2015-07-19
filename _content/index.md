---
title: Home
---

# Nog
Nog is a [Grunt](http://gruntjs.com)-based site manager for GitHub Pages.
It strives to be brutally simple.


## Quick Start

First, [fork your own Nog](https://github.com/nowzoo/nog#fork-destination-box).

```
# clone your fork (replace YOUR_USER)...
$ git clone git@github.com:YOUR_USER/nog.git

$ cd nog

# install the dependencies...
$ npm install

# then...
$ ./nog

```

Then...

- Visit your site at <http://localhost:3000/nog/>.
- Make changes in the `\_content`, `\_cfg`, `\_assets` and `\_templates` directories.
- The changes you make will automatically show up on the local site (as long as you've got livereload enabled in the browser.)

When you want to publish your changes to your GitHub Pages site, open up a separate terminal tab and...

```
$ grunt nog:push
```

To see what your site currently contains, and diagnose any problems:

```
$ grunt nog:lint
```

## Managing Content

### The \_content Directory

Any `.md` or `.html` file in the `_content` directory will be turned into a page on the site. Where a content file is found inside this directory determines several things:

 - the `id` of the page
 - the resulting URL
 - the page's parent and children
 - whether the content is treated as:
   - a plain "evergreen" page or
   - a blog post, existing in an archive ordered by date

For example:


| Content File Path | URL | ID  | Parent |
| ------------- |-------------| -----| - |
| index.md |/  | `index`| |
| about.md | /about      |   `about` | |
| help.md | [ignored]     |    | |
| help/index.md | /help      |   `help` | |
| help/advanced.md | [ignored] |  | |
| help/advanced.html | /help/advanced  | `help/advanced` | `help` |
|foo.md| /foo| `foo`|    |
|foo/bar.md| /foo/bar | `foo/bar`| `foo`|
|posts/archive.md| /posts | `posts' | |
|| other archive URLs (see below)|  | |
|posts/my-first-post.md| /posts/my-first-post|  `posts/my-first-post`| |



Note the following rules:

 - Index files take precedence: `help/index.md` is used instead of `help.md`
 - HTML files take precedence over Markdown files: `help/advanced.html` is used instead of `help/advanced.md`
 - If a directory has a file named `archive.md`, the other files in the directory will be treated as blog posts, ordered by date, and a variety of date- and tag-based archive URLs will be generated.


### Content Metadata

Page metadata, such as the title, is defined by inserting an optional YAML front matter section at the top of your content  files. The front matter section consists of:

 - three dashes `---` and a line break
 - some YAML
 - three dashes `---` and a line break

For example, a valid page file in Markdown might look like this:

```
---
title: My Valid Page
excerpt: Who dee woot who dee woo too?
some_complex_yaml: Some complex data structure which will bring about the destruction of our foes.
---
# The Actual Content Begins Here
## My Personal Strong Suits
 - Humanity
 - Peace
 - Speling
```

By default and design, Nog doesn't care very much or make assumptions about what a page's metadata has or doesn't have. That said, Nog provides the following sensible default values:

 - `title`

 If missing, Nog uses the un-dasherized ucword-ed name of the file. Thus `my-great-page` will result in a title of My Great Page.

 - `date`

 If missing (or if the value can't be parsed as a Date) this is set to the modified time of the file. You can use any parseable format, but you can't go wrong with `YYYY/MM/DD HH:mm`.

 - `excerpt`

 If missing, Nog uses the first 255 characters of the strip-tagged content, with all consecutive whitespaces converted to a single space character.

 - `template`

 If missing, assumed to be `page.twig` if the content is a plain page, `post.twig` if it's a blog post or `archive.twig` if it's an archive of blog posts. This value should always be relative to the `_templates` directory.

### Post Archives

When Nog encounters an `directory-name/archive.md` file the other contents of  `directory-name` are treated as blog posts, and a variety of archive URLs are automatically generated. If you have a directory named `posts` containing an `archive.md` file and 12 other content files all dated July 4, 2015 and all tagged "News Flash", the following URLs will be generated:

|URL| |
|--|--|
|/posts| The first 10 posts|
|/posts/p/2| The second page of posts, with the last two posts|
|/posts/2015| The archive for 2015|
|/posts/2015/p/2| ..second page|
|/posts/2015/07| The archive for July|
|/posts/2015/07/p/2| ..second page|
|/posts/2015/07/04| The archive for July 4|
|/posts/2015/07/04/p/2| ..second page|
|/posts/tag/news-flash| Tag archive for "News Flash"|
|/posts/tag/news-flash/p/2| ...second page|

##### Modifying Archive Defaults

You can modify how Nog generates archives either globally, in your `_cfg/site.json` file or on a case-by-case basis using YAML front matter section in your `archive.md` file.


- `archives.posts_per_page` Default: `10`. If set to `0`, no paging will occur, that is, all archive URLs will display all matching posts.

- `archives.generate_dates` Default: `true`. Whether or not to generate date based archives.

- `archives.generate_tags` Default: `true`. Whether or not to generate tag archives.

- `archives.tag_slug`  Default: `'tag'`. The slug to insert before the individual tag slug.

- `archives.page_slug`  Default: `'p'`. The slug to insert before the page number (for archive pages > 1).


In `_cfg/site.json`...
```
{
    "archives": {
        "posts_per_page": 14,
        "generate_tags": false,
        "page_slug": "page"
    }
}
```

In `posts/archive.md`...

```
---
generate_tags: false
---
```

### Directory Structure

After running `grunt build` for the first time, your directory will look like this:

- \_site/
- node_modules/
- nog/
- _assets/
- _content/
- _templates/
- .gitignore
- Gruntfile.js
- LICENSE
- package.json
- README.md


The **_site/** directory is where Nog places the generated site content. **These files should not be edited**: the entire directory is overwritten each time the site is built.

The **_assets/** directory contains "static" assets such as images and stylesheets. Anything you place here,either by hand or via a build process is copied wholesale to the site root on build.

The **_content/** directory is where you create and edit posts and pages.

The **_templates/** directory contains the template files for your site.

**Gruntfile.js** contains a `nog` config which you should edit to change your site; also contains some build processes for the stylesheet of the default site. See the Configuration section below.


### Repo Structure and Pushing Changes

GitHub Pages sites rely special branch called `gh-pages`. Nog doesn't maintain this branch in the local repository. Instead, when you run the `grunt push` task, Nog creates a temporary directory to pull the current `gh-pages` branch from GitHub and push your changes back up.

Nog's `grunt push` task only pushes the `gh-pages` branch, leaving it up to you to pull and push changes on other branches (e.g.`master`) in the normal way via git.



### Tasks

#### grunt build

```
$ grunt build
```
Builds the site in the **_site** directory, creating HTML files and copying over the contents of the **_assets** directory.

#### grunt push

```
$ grunt push
```
Pushes the site content to the gh-pages branch on GitHub.

#### grunt serve <--port=3000>

```
$ grunt serve
```
Serve the site on your local machine. Optionally supply a port for the server:

```
$ grunt serve --port=3002
```

#### grunt show[:what]

```
$ grunt show # all the data
$ grunt show:site # site options
$ grunt show:index # about the home page
$ grunt show:pages # about the pages
$ grunt show:posts # about the posts
$ grunt show:archives # about the main and date-based archives
$ grunt show:tags # about the tag archives
$ grunt show:search #search words data
# show more than one thing...
$ grunt show:posts:tags
```
Log data about the site as it would currently be built to the console.

### Watches

#### grunt watch
```
$ grunt watch
```
Runs all the watches described below, plus any that you've defined.


#### grunt watch:build
```
$ grunt watch:build
```
Watches the _assets, _content, and _templates directories, and runs the build task when changes occur.

#### grunt watch:livereload

```
$ grunt watch:livereload
```

Enables a live reload server, watching the \_site directory for changes. You'll have to [enable livereload with a script or browser extension](https://github.com/gruntjs/grunt-contrib-watch/blob/master/docs/watch-examples.md#enabling-live-reload-in-your-html).

### Nog Site Configuration

#### assets_copy_to_subdir

string|boolean

Default: `false`

By default, Nog copies the contents of the `_assets/` directory to the site's root. For example, if you have a favicon at `_assets/favicon.ico` that file will exist at http://your-site/favicon.ico.

You can tell Nog to place the assets in a subfolder. Setting the config option to `true` will place the assets in a folder called `assets`. Setting it to a `'path'` will place the assets in a folder called `path`.




```
{
        title: 'Nog',
        tagline: 'A Grunt-based site manager for GitHub Pages.',
        site_url: '',
        site_prefix: '/nog',
        posts_per_page: 10,
        assets_copy_to_subdir:  false,
        atomic_path: function (post, id) {
            var slugs;
            var type = post.type;
            if (type === 'post') {
                return path.join('posts', id);
            }
            slugs = post.parents ? _.clone(post.parents) : [];
            slugs.push(id);
            return slugs.join('/');
        },
        archive_path: function (archive, page) {
            var type = archive.type;
            var p;
            page = page || 0;

            switch (type) {
                case 'main':
                    p = 'posts';
                    break;
                case 'year':
                case 'month':
                case 'day':
                    p = path.join('posts', archive.slug);
                    break;
                case 'tag':
                    p = path.join('tags', archive.slug);
                    break;
                default:
                    throw(new Error('Unknown archive type'));
                    break;
            }
            if (page > 0) {
                p = path.join(p, 'page', page.toString());
            }
            return p;
        },
        search_path: function () {
            return 'search';
        }
    }
```
