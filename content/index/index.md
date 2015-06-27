---

title: Home
published: 2015/06/20 15:13:56

---

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
# initialize the site...
$ grunt init
# serve the site locally...
$ grunt serve
```    

At this point you can see your site at <http://localhost:3000/nog/>.
    
### Directory Structure

After running `grunt init` your directory will look like this:

 - `_site` The directory where Nog places the generated site content. **These files should not be edited** &mdash;
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
 
### Repository and Branch Structure
 
GitHub Pages sites rely special branch called `gh-pages`. Nog maintains this branch in a **separate** repository in the `_site` directory. All other branches, for example, `master`, reside in the root directory.

The `grunt push` task pushes both the the current main branch (e.g. `master`) and the `gh-pages` branch in the `_site` folder. 
 


### Grunt Tasks

`$ grunt init`

Initializes the site. This is a necessary step after cloning a repo.

## Watchers

`$ grunt watch:build`

`$ grunt watch:serve`

Enables live reload.


#### grunt init

- checks whether a local gh-pages branch exists `git show-ref`
- deletes the gh-pages if it exists `git branch -D gh-pages`
- creates a gh-pages branch `git checkout --orphan gh-pages`
- adds a `.gitignore` file that ignores all the files and folders that are not part of the site. Users can modify this list with `nog.ignored_files`
- pulls from the origin: `git pull origin gh-pages`



#### grunt build

- On the current branch:
  - gets the current branch name and status from `git_get_status`
  - if ! status.clean
    - git add -A
    - git commit -m 'message'
  - Gather the data
  - Delete  all the files in _site      
- `git checkout gh-pages` On the gh-pages branch:
       
  


