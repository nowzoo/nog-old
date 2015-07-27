'use strict';
var get_relative_url = require('./get_relative_url');
module.exports = function(site, base_uri){
    return site.url + get_relative_url(base_uri);
};

