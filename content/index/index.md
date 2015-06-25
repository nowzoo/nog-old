---

title: Home
published: 2015/06/20 15:13:56

---

# Nog
Nog is a simple site generator for GitHub Pages using [Grunt](http://gruntjs.com).

## Quick Start

First, [fork Nog](https://github.com/nowzoo/nog#fork-destination-box).
 

```
# clone your fork (replace YOUR_USER!)...
$ git clone git@github.com:YOUR_USER/nog.git

# switch to the nog directory...
$ cd nog

# install the dependencies...
$ npm install

# initialize the site...
$ grunt init

# build the site...
$ grunt build

# serve the site locally
$ grunt serve
Running "serve" task
>> Server listening on port 3000. Go to  http://localhost:3000/nog
>> Press ^C to stop.

# After making some content changes (see below), push your site to GitHub Pages
$ grunt push
```    
    

    
Make changes to the content in the `content` directory.


## Grunt Tasks

`$ grunt init`

Initializes the site. This is a necessary step after cloning a repo.

## Watchers

`$ grunt watch:build`

`$ grunt watch:serve`

Enables live reload.


