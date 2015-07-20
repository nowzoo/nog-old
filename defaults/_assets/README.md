

# Nog
Nog is a [Grunt](http://gruntjs.com)-based site manager for GitHub Pages. It strives to be

 - simple to learn and operate,
 - unopinionated,
 - adaptable to different build flows.



### Quick Start

First, [fork your own Nog](https://github.com/nowzoo/nog#fork-destination-box).


```
# clone your fork (replace YOUR_USER)...
$ git clone git@github.com:YOUR_USER/nog.git
$ cd nog
# install the dependencies...
$ npm install
# build the site...
$ grunt build
# serve the site locally...
$ grunt serve
```

At this point you can see your site at <http://localhost:3000/nog/>.

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
