'use strict';
var path = require('path');
var get_basename = require('./get_basename');
module.exports = function(content){
    var basename = get_basename(content);
    var parts = content.relative_path.split(path.sep);
    parts.pop();
    if ('index' !== basename){
        parts.push(basename);
    }
    return parts.join('/');

};
