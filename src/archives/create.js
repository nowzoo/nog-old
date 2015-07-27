"use strict";
var _ = require('lodash');

var get_main_archives_id = require('./get_main_archives_id');
var get_main_archives_uri = require('./get_main_archives_uri');
var get_relative_url = require('../content/get_relative_url');
var get_absolute_url = require('../content/get_absolute_url');
var sort_blog_posts = require('../content/sort_blog_posts');

var add_post_to_date_archives = require('./add_post_to_date_archives');
var add_post_to_tag_archive = require('./add_post_to_tag_archive');
var paginate_archive = require('./paginate_archive');

module.exports = function(site, contents){
    var archives;
    var uri = get_main_archives_uri(site);
    var posts = _.where(contents, {type: 'post', published: true, ignored: false});
    sort_blog_posts(posts);

    archives = {
        main: {
            id: get_main_archives_id(site),
            uri: uri,
            relative_url: get_relative_url(uri),
            absolute_url: get_absolute_url(site, uri),
            type: 'main',
            title: site.archives_title,
            posts: posts
        },
        tags: {},
        dates: {}

    };
    _.each(posts, function(post){
        add_post_to_date_archives(site, archives, post);
        _.each(post.tags, function(tag){
            add_post_to_tag_archive(site, archives, post, tag);
        });
    });

    paginate_archive(site, archives.main);
    _.each(archives.tags, function(archive){
        paginate_archive(site, archive);
    });
    _.each(archives.dates, function(archive){
        paginate_archive(site, archive);
    });



    return archives;
};
