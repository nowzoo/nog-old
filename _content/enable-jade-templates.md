---
title: Enable Jade Templates
date: 2015/07/22
tags: template engine, templates
---

By default Nog uses [swig](http://paularmstrong.github.io/swig/) as its template engine.

You can change this behavior by providing Nog a custom `template_render(template_path, data, callback)` function that calls back with an error (if the rendering somehow fails) and the rendered HTML.

The following example enables Jade as well as Swig. Make sure you have Jade installed (Nog doesn't install it by default)...
```
$ npm install --save jade
```

Create a file called `_cfg/template_render.js`...

```
/* jshint node: true */
module.exports = function(template_path, data, callback){
    "use strict";

    var path = require('path');
    var jade = require('jade');
    var swig = require('swig');

    var rendered;
    var ext = path.ext(template_path);

    switch(ext){
        case '.jade':
            rendered = jade.renderFile(template_path, {cache: false, globals: data});
            callback(null, rendered);
            break;
        case '.twig':
            swig.renderFile(template_path, data, function(err, result){
                rendered = result;
                callback(err, rendered);
            });
            break;
        default:
            callback(new Error('Unrecognized template extension"' + ext + '".'));
            break;
    }
};
```

In `_cfg/nog.js`...

```
module.exports = function(nog, callback){
    "use strict";
    // other config...

    nog.template_render = require('./template_render');

    callback(null, nog);
};
```
