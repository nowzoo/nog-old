"use strict";
var _ = require('lodash');

var get_relative_url = require('../content/get_relative_url');
var get_absolute_url = require('../content/get_absolute_url');
var get_paged_uri = require('../content/get_paged_uri');


module.exports = function(site, archive){
    var pages;
    archive.post_count = archive.posts.length;
    if (0 < site.archives_posts_per_page){
        archive.page_count = Math.ceil(archive.posts.length / site.archives_posts_per_page);
        pages = _.chunk(archive.posts, site.archives_posts_per_page);
    } else {
        archive.page_count = 1;
        pages = [archive.posts];
    }
    archive.is_paged = 1 < archive.page_count;
    archive.pages = [];
    _.each(pages, function(posts, i){
        var uri = get_paged_uri(site, archive.uri, i);
        archive.pages.push({
            posts: posts,
            uri: uri,
            relative_url: get_relative_url(uri),
            absolute_url: get_absolute_url(site, uri),
            post_count: posts.length,
            page: i
        });

    });
};
