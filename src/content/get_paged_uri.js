'use strict';
var path = require('path');
module.exports = function(site, base_uri, page){
    var parts = [base_uri];
    page = page || 0;
    if (page > 0){
        parts.push(site.archives_page_slug);
        parts.push((page + 1).toString());
    }
    return parts.join('/');
};

