'use strict';
var path = require('path');

module.exports = function(site, content){
    var extension = path.extname(content.relative_path);
    return site.content_extensions.indexOf(extension) === -1;
};
