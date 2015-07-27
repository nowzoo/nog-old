'use strict';
var path = require('path');

module.exports = function(content){
    return path.basename(content.relative_path, path.extname(content.relative_path));
};