var _ = require('lodash');

var get_id = require('./get_id');
var is_ignored = require('./is_ignored');
var get_published = require('./get_published');


module.exports = function(build, site, content, contents){
    var id = get_id(content);
    var children = [];

    _.each(contents, function(possible_child){
        var child_id = get_id(possible_child);
        var parts = child_id.split('/');
        parts.pop();
        if (parts.join('/') !== id) return;
        if (is_ignored(build, site, possible_child, contents)) return;
        if (! get_published(build, possible_child)) return;
        children.push(possible_child);
    });
    return children;
};
