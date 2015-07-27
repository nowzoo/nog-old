'use strict';
var path = require('path');
var _ = require('lodash');

var get_published = require('./get_published');
var get_basename = require('./get_basename');
var is_ignored_bad_slugs = require('./is_ignored_bad_slugs');
var is_ignored_extension = require('./is_ignored_extension');
var is_ignored_conflicts_with_archive = require('./is_ignored_conflicts_with_archive');
var is_ignored_overridden_by_sibling = require('./is_ignored_overridden_by_sibling');

module.exports = function(build, site, content, contents){
    var ignored = false;
    var dir = path.dirname(content.relative_path);
    var basename = get_basename(content);


    _.each(site.content_extensions, function(extension){
        var conflict;
        var p = path.join(dir, basename, 'index' + extension);
        conflict = _.findWhere(contents, {relative_path: p});

        if (conflict) {
            //if (is_ignored_bad_slugs(conflict)) return;
            //if (is_ignored_extension(site, conflict)) return;
            //if (is_ignored_conflicts_with_archive(site, conflict)) return;
            //if (is_ignored_overridden_by_sibling(build, site, conflict, contents)) return;
            if (! get_published(build, conflict)) return;
            ignored = true;
        }

    });
    return ignored;
};

