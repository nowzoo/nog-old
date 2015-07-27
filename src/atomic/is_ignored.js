'use strict';
var _ = require('lodash');

var is_ignored_bad_slugs = require('./is_ignored_bad_slugs');
var is_ignored_extension = require('./is_ignored_extension');
var is_ignored_conflicts_with_archive = require('./is_ignored_conflicts_with_archive');
var is_ignored_overridden_by_sibling = require('./is_ignored_overridden_by_sibling');
var is_ignored_overridden_by_index = require('./is_ignored_overridden_by_index');

module.exports = function(build, site, content, contents){
    if (is_ignored_bad_slugs(content)) return true;
    if (is_ignored_extension(site, content)) return true;
    if (is_ignored_conflicts_with_archive(site, content)) return true;
    if (is_ignored_overridden_by_sibling(build, site, content, contents)) return true;
    if (is_ignored_overridden_by_index(build, site, content, contents)) return true;
    return false;
};
