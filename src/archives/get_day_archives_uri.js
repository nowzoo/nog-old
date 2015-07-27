'use strict';
var get_paged_uri = require('../content/get_paged_uri');
var get_day_archives_id = require('./get_day_archives_id');
var get_prefixed_uri = require('../content/get_prefixed_uri');


module.exports = function(site, d, page){
    var id = get_day_archives_id(site, d);
    var prefixed = get_prefixed_uri(site, id);
    return get_paged_uri(site, prefixed, page);
};

