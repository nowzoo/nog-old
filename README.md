# Nog
A simple site generator for GitHub Pages.

## Quick Start

[Fork the repo](https://github.com/nowzoo/nog) and clone the fork to your local machine.

    git clone git@github.com:YOUR_USER/nog.git
    cd nog
    
Fetch the remote `gh-pages` branch and create a local `gh-pages` branch:

    git fetch origin gh-pages:gh-pages
    
    
Still on the `master` branch, install the dependencies.   
    
    npm install   
    
At this point you have a `master` branch, where you'll create and manage site content, and a `gh-pages` 
    branch which functions as the site itself. You don't need to worry about the `gh-pages` branch --
    do all your work in `master`.
       
In `master`:
       


Tell `grunt` to build the site:
     
     grunt build

