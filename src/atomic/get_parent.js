var _ = require('lodash');

var get_id = require('./get_id');
var is_ignored = require('./is_ignored');
var get_published = require('./get_published');

module.exports = function(build, site, content, contents){
    var parts;
    var id = get_id(content);
    var parent_id;
    var parent = null;

    parts = id.split('/');
    parts.pop();
    parent_id = parts.join('/');
    if ('' === parent_id) return null;
    _.each(contents, function(possible_parent){
        if (get_id(possible_parent) !== parent_id) return;
        if (is_ignored(build, site, possible_parent, contents)) return;
        if (! get_published(build, possible_parent)) return;
        parent = possible_parent;
    });
    return parent ? parent : null;
};
