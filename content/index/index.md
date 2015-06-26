---

title: Home
published: 2015/06/20 15:13:56

---

# Nog
Nog is a simple site generator for GitHub Pages using [Grunt](http://gruntjs.com).

### Quick Start

First, [fork Nog](https://github.com/nowzoo/nog#fork-destination-box).
 

```
# clone your fork (replace YOUR_USER!)...
$ git clone git@github.com:YOUR_USER/nog.git 
$ cd nog
# install the dependencies...
$ npm install
# initialize the site...
$ grunt init
# serve the site locally...
$ grunt serve
```    

At this point you can see your site at <http://localhost:3000/nog/>.
    
### Directory and Repository Structure

After running `grunt init` your directory will look like this:

 - `_site` The directory where Nog places the generated site content. These files should not be edited &mdash;
    the entire directory is overwritten each time the site is built.
 - `assets` This directory contains "static" assets such as images and stylesheets. Anything you place here,
   either by hand or via a build process is copied wholesale to the site root on build.
 - `content` This directory is where you create and edit posts and pages.
 - `grunt` Contains Nog's Grunt tasks and helpers.
 - `node_modules`  
 - `templates` This directory contains the template files for your site.
 - `.gitignore`
 - `Gruntfile.js` The task loader. Contains a `nog` config which you should edit to change your site; also contains
   some build processes for the stylesheet of the default site.
 - `LICENSE`
 - `package.json`
 - `README.md`
 
 

 

    
Make changes to the content in the `content` directory.


### Grunt Tasks

`$ grunt init`

Initializes the site. This is a necessary step after cloning a repo.

## Watchers

`$ grunt watch:build`

`$ grunt watch:serve`

Enables live reload.


