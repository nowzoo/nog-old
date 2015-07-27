"use strict";
var path = require('path');


var log = require('../utils/log');

module.exports = function(build, site, absolute_path){
    var assets_path = path.join(build.input_directory, '_assets');
    var relative_path = path.relative(assets_path, absolute_path);
    var slugs = relative_path.split(path.sep);

    if (site.assets_copy_to_subdir){
        slugs.unshift(site.assets_copy_to_subdir);
    }
    if (! build.public && site.prefix.length > 0){
        slugs.unshift(site.prefix);
    }
    return slugs.join('/')
};
