'use strict';
var path = require('path');
var _ = require('lodash');

var get_published = require('./get_published');
var get_basename = require('./get_basename');
var is_ignored_bad_slugs = require('./is_ignored_bad_slugs');
var is_ignored_extension = require('./is_ignored_extension');
var is_ignored_conflicts_with_archive = require('./is_ignored_conflicts_with_archive');

module.exports = function(build, site, content, contents){
    var conflict;
    var ignored = false;
    var content_ext;
    var conflict_ext;
    var possible = [];
    var dir = path.dirname(content.relative_path);
    var basename = get_basename(content);

    _.each(site.content_extensions, function(extension){
        var conflict;
        var p = path.join(dir, basename + extension);
        if (p !== content.relative_path){
            conflict = _.findWhere(contents, {relative_path: p});
            if (conflict) {
                //if (is_ignored_bad_slugs(conflict)) return;
                //if (is_ignored_extension(site, conflict)) return;
                //if (is_ignored_conflicts_with_archive(site, conflict)) return;
                if (! get_published(build, conflict)) return;
                possible.push(conflict);
            }
        }
    });


    conflict = _.first(possible);
    if (conflict){
        content_ext = path.extname(content.relative_path);
        conflict_ext = path.extname(conflict.relative_path);

        if (site.content_extensions.indexOf(content_ext) > site.content_extensions.indexOf(conflict_ext)){
            ignored = true;
        }
    }
    return ignored;
};

