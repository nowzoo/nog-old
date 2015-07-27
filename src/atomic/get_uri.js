'use strict';

var get_id = require('./get_id');
var get_prefixed_uri = require('../content/get_prefixed_uri');

module.exports = function(site, content){
    var id = get_id(content);
    var parts = [];
    if (id.length > 0){
        parts.push(id);
    }
    return get_prefixed_uri(site, parts.join('/'));
};
