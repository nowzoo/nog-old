'use strict';
var get_prefixed_uri = require('../content/get_prefixed_uri');
var get_paged_uri = require('../content/get_paged_uri');
var get_tag_archives_id = require('./get_tag_archives_id');

module.exports = function(site, tag_slug, page){
    var id = get_tag_archives_id(site, tag_slug);
    var prefixed = get_prefixed_uri(site, id);
    return get_paged_uri(site, prefixed, page);
};

