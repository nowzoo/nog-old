"use strict";
var _ = require('lodash');
var S = require('string');
var sprintf = require('sprintf-js').sprintf;


var get_relative_url = require('../content/get_relative_url');
var get_absolute_url = require('../content/get_absolute_url');
var get_tag_archives_id = require('./get_tag_archives_id');
var get_tag_archives_uri = require('./get_tag_archives_uri');



module.exports = function(site, archives, post, tag_string){
    var slug;
    var uri;
    tag_string = tag_string.trim();
    slug = S(tag_string).slugify().s;
    uri = get_tag_archives_uri(site, slug);


    if (!_.has(archives.tags, slug)){

        archives.tags[slug] = {
            id: get_tag_archives_id(site, slug),
            uri: uri,
            relative_url: get_relative_url(uri),
            absolute_url: get_absolute_url(site, uri),
            type: 'tag',
            name: tag_string,
            title: sprintf(site.archives_tag_title_format, tag_string),
            posts: []

        };
    }
    archives.tags[slug].posts.push(post);
};
