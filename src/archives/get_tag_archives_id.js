'use strict';
var path = require('path');
var get_main_archives_id = require('./get_main_archives_id');


module.exports = function(site, tag_slug){
    var parts = [get_main_archives_id(site)];
    parts.push(site.archives_tag_slug);
    parts.push(tag_slug);
    return parts.join('/')
};

