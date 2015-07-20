'use strict';
var async = require('async');
var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var glob = require('glob');
var fs = require('fs');
//var utils = require('./utils');
var S = require('string');
var marked = require('marked');
var yamlFront = require('yaml-front-matter');
var sprintf = require('sprintf-js').sprintf;

var utils = require('./utils');
var atomic = require('./atomic');




var read = module.exports.read = function(build_data,  callback){
    var contents = {};
    async.waterfall(
        [
            function (callback) {
                var p = path.join(build_data.content_directory, '**', '*.*');
                glob(p, callback);
            },
            function(files, callback){
                async.each(files, function(absolute_path, callback){
                    atomic.read(build_data, absolute_path,  function(err, result){
                        contents[result.relative_path] = result;
                        callback(err);
                    });
                }, callback);
            },

        ],
        function(err){
            callback(err, contents);
        }
    )

};

var init_archives = module.exports.init_archives = function(build_data){
    var archives;
    var slugs = [build_data.config.archives_directory];
    if (0 < build_data.config.prefix.length && ! build_data.is_build_public){
        slugs.unshift(build_data.config.prefix);
    }
    var relative_url = '/' + slugs.join('/') + '/';

    archives = {
        main: {
            type: 'main',
            title: build_data.config.archives_title,
            posts: [],
            slugs: slugs,
            relative_url: relative_url,
            absolute_url: build_data.config.url + relative_url
        },
        tags: {},
        dates: {},

    };
    return archives;
};

var get_posts = module.exports.get_posts = function(build_data){
    var posts = [];
    _.each(build_data.contents, function(content){
        if ('post' !== atomic.get_type(build_data, content)) return;
        if (atomic.get_is_ignored_bad_uri(build_data, content)) return;
        if (atomic.get_is_ignored_extension(build_data, content)) return;
        if (atomic.get_is_ignored_overridden_by_sibling(build_data, content)) return;
        if (atomic.get_is_ignored_overridden_by_index(build_data, content)) return;
        if (! atomic.get_published(build_data, content)) return;
        posts.push(content);
    });
    return posts;
};

var sort_posts = module.exports.sort_posts = function(build_data, posts){
    posts.sort(function(a, b){
        var a_date = atomic.get_date(build_data, a);
        var b_date = atomic.get_date(build_data, b);
        var a_title = atomic.get_title(build_data, a).toLowerCase();
        var b_title = atomic.get_title(build_data, b).toLowerCase();
        if (a_date.isBefore(b_date)) return 1;
        if (a_date.isAfter(b_date)) return -1;
        if (a_title < b_title) return -1;
        if (a_title > b_title) return 1;
        return 0;
    })

};

var add_post_to_tag = module.exports.add_post_to_tag = function(build_data, archives, content, tag_string){
    var slug = S(tag_string).trim().slugify().s;
    var relative_url;
    var slugs;
    tag_string = tag_string.trim();
    if (!_.has(archives.tags, slug)){
        slugs = archives.main.slugs.concat([build_data.config.archives_tag_slug, slug]);
        relative_url = '/' + slugs.join('/') + '/';
        archives.tags[slug] = {
            type: 'tag',
            name: tag_string,
            title: sprintf(build_data.config.archives_tag_title_format, tag_string),
            posts: [],
            slugs: slugs,
            relative_url: relative_url,
            absolute_url: build_data.config.url + relative_url
        };
    }
    archives.tags[slug].posts.push(content);

};

var add_post_to_date_archives = module.exports.add_post_to_date_archives = function(build_data, archives, content){
    _.each(['year', 'month', 'day'], function(type){
        var relative_url;
        var title_format = build_data.config['archives_' + type + '_title_format'];
        var name_format = build_data.config['archives_' + type + '_name_format'];
        var date = moment(atomic.get_date(build_data, content));
        var slug;
        var slugs;
        var date_slugs = [date.format('YYYY')];
        if ('year' !== type){
            date_slugs.push(date.format('MM'));
            if ('month' !== type){
                date_slugs.push(date.format('DD'))
            }
        }
        slugs = archives.main.slugs.concat(date_slugs);
        slug = date_slugs.join('/');
        relative_url = '/' + slugs.join('/') + '/';
        if (!_.has(archives.dates, slug)){

            archives.dates[slug] = {
                type: type,
                name: date.format(name_format),
                title: sprintf(title_format, date.format(name_format)),
                posts: [],
                slugs: slugs,
                relative_url: relative_url,
                absolute_url: build_data.config.url + relative_url
            };
        }
        archives.dates[slug].posts.push(content);
    });

};

var paginate_archive = module.exports.paginate_archive = function(build_data, archive){
    var relative_url;
    var pages;
    sort_posts(build_data, archive.posts);
    archive.post_count = archive.posts.length;
    if (0 < build_data.config.archives_posts_per_page){
        archive.page_count = Math.ceil(archive.posts.length / build_data.config.archives_posts_per_page);
        pages = _.chunk(archive.posts, build_data.config.archives_posts_per_page);
    } else {
        archive.page_count = 1;
        pages = [archive.posts];
    }
    archive.is_paged = 1 < archive.page_count;
    archive.pages = [];
    _.each(pages, function(posts, i){
        var page;
        var slugs = archive.slugs.concat([]);
        var relative_url;

        if (0 < i){
            slugs.push(build_data.config.archives_page_slug);
            slugs.push((i + 1).toString());
        }
        relative_url = '/' + slugs.join('/') + '/';
        archive.pages.push({
            posts: posts,
            post_count: posts.length,
            page: i,
            slugs: slugs,
            relative_url: relative_url,
            absolute_url: build_data.config.url + relative_url
        })

    });
};

var get_archives = module.exports.get_archives = function(build_data){
    var archives = init_archives(build_data);
    var posts = get_posts(build_data);
    sort_posts(build_data, posts);
    _.each(posts, function(content) {
        var tags;
        archives.main.posts.push(content);
        tags = atomic.get_tags(build_data, content);
        _.each(tags, function (tag) {
            add_post_to_tag(build_data, archives, content, tag);
        });
        add_post_to_date_archives(build_data, archives, content);
    });
    _.each([archives.main].concat(_.values(archives.tags), _.values(archives.dates)), function(archive){
       paginate_archive(build_data, archive);
    });
    return archives;
};

var get_search_index = module.exports.get_search_index = function (build_data) {
    var search_index = {};
    var published = {};
    var relative_url;
    _.each(build_data.contents, function(content){
        var published_object;
        var search_words;
        if (atomic.get_is_ignored_bad_uri(build_data, content)) return;
        if (atomic.get_is_ignored_extension(build_data, content)) return;
        if (atomic.get_is_ignored_conflicts_with_archive(build_data, content)) return;
        if (atomic.get_is_ignored_overridden_by_sibling(build_data, content)) return;
        if (atomic.get_is_ignored_overridden_by_index(build_data, content)) return;
        if (! atomic.get_published(build_data, content)) return;

        relative_url = atomic.get_relative_url(build_data, content);
        search_words = atomic.get_search_words(build_data, content);
        published[relative_url] = {
            relative_url: relative_url,
            absolute_url: atomic.get_absolute_url(build_data, content),
            title: atomic.get_title(build_data, content),
            excerpt: atomic.get_excerpt(build_data, content)
        };

        _.each(search_words, function(word){
            word = word.trim().toLowerCase();
            if (!_.has(search_index, word)){
                search_index[word] = [];
            }
            search_index[word].push(relative_url);
        });
    });

    return {
        content: published,
        index: search_index
    };
};






