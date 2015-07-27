'use strict';
var async = require('async');

var get_id = require('./get_id');
var get_type = require('./get_type');
var get_uri = require('./get_uri');
var get_basename = require('./get_basename');
var get_title = require('./get_title');
var get_date = require('./get_date');
var get_published = require('./get_published');
var get_tags = require('./get_tags');
var get_template = require('./get_template');
var get_parent = require('./get_parent');
var get_children = require('./get_children');
var get_content = require('./get_content');
var get_excerpt = require('./get_excerpt');
var get_relative_url = require('../content/get_relative_url');
var get_absolute_url = require('../content/get_absolute_url');


var is_ignored = require('./is_ignored');

module.exports = function(build, site, content, contents, callback){

    content.id = get_id(content);
    content.uri = get_uri(site, content);
    content.basename = get_basename(content);
    content.type = get_type(site, content);
    content.title = get_title(content);
    content.date = get_date(content);
    content.published = get_published(build, content);
    content.tags = get_tags(content);
    content.template = get_template(site, content);
    content.ignored = is_ignored(build, site, content, contents);
    content.parent = get_parent(build, site, content, contents);
    content.children = get_children(build, site, content, contents);
    content.relative_url = get_relative_url(content.uri);
    content.absolute_url = get_absolute_url(site, content.uri);

    async.series(
        [
            function(callback){
                get_content(build, site, content, function(err, result){
                    content.content = result;
                    callback(null);
                });
            },
            function(callback){
                get_excerpt(build, site, content, content.content, function(err, result){
                    content.excerpt = result;
                    callback(null);
                });
            }
        ],
        callback
    );

};
