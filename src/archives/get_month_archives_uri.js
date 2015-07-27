'use strict';
var get_prefixed_uri = require('../content/get_prefixed_uri');
var get_paged_uri = require('../content/get_paged_uri');
var get_month_archives_id = require('./get_month_archives_id');

module.exports = function(site, d, page){
    var id = get_month_archives_id(site, d);
    var prefixed = get_prefixed_uri(site, id);
    return get_paged_uri(site, prefixed, page);
};

