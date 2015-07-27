'use strict';
module.exports = function(site, base_uri){
    var parts = [];
    if (base_uri.length > 0){
        parts.push(base_uri);
    }
    if (site.prefix.trim().length > 0){
        parts.unshift(site.prefix.trim());
    }
    return parts.join('/');
};

