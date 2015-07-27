---
title: Change How Nog Renders Markdown
date: 2015/07/22
---

By default Nog uses [marked](https://github.com/chjj/marked) and [highlight.js](https://highlightjs.org/) to render Markdown.

You can change this behavior by providing Nog a custom `markdown_render(markdown_string, callback)` function that calls back with an error (if the rendering somehow fails) and the rendered HTML.

Create a file called `_cfg/markdown_render.js`...

```
/* jshint node: true */
module.exports = function(markdown_string, callback){
    "use strict";
    var async = require('async');
    var rendered;
    async.series(
        [
            //do your stuff...
            function(callback){
                rendered = 'The quick brown fox.';
                callback(null);
            }
        ],
        function(err){
            callback(err, rendered);
        }
    );
};
```

In `_cfg/nog.js`...

```
module.exports = function(nog, callback){
    "use strict";
    // other config...

    nog.markdown_render = require('./markdown_render');

    callback(null, nog);
};
```
