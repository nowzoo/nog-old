'use strict';
var path = require('path');

module.exports = function(site, build, uri){
    var slugs;
    if (uri.length > 0){
        slugs = uri.split('/');
    } else {
        slugs = [];
    }


    slugs.push('index.html');
    if (build.public){
        if (0 < site.prefix.length){
            slugs.shift();
        }
    }
    return slugs.join(path.sep);
};
