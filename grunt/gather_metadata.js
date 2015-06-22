/* jshint node: true */
module.exports = function (grunt) {
    'use strict';
    var moment = require('moment');
    var fs = require('fs');
    var path = require('path');
    var _ = require('lodash');
    var S = require('string');
    var marked = require('marked');
    var yamlFront = require('yaml-front-matter');
    var stopwords = require('stopwords').english;

    var files = grunt.file.expand('content/*.md');
    var nog_config = grunt.config.get('nog');
    var atomic_metadata = {};
    var assets = grunt.file.expand('assets/**/*');
    var atomic_errors = {};
    var archives = {};
    var tag_archives = {};
    var search = {};



    var add_atomic_error = function(id, error){
        if (!_.has(atomic_errors, id)){
            atomic_errors[id] = [];
        }
        atomic_errors[id].push(error);
    };


    var add_search_word = function(word, id){
        word = S(word).trim().toLowerCase().stripPunctuation().s;
        if (_.indexOf(stopwords, word) !== -1) return;
        if (! word.length === 0) return;
        if (! word.match(/\w/)) return;
        if (!_.has(search, word)){
            search[word] = [];
        }
        search[word].push(id);
    };


    var populate_archive_paging = function(archive){
        var pages = [];
        var ids_by_page;
        var paging;
        var num_pages;
        var posts = archive.posts;
        var rpp = parseInt(nog_config.posts_per_page);
        if (isNaN(rpp)) rpp = 10;
        if (rpp < 1) rpp = 10;
        num_pages = Math.ceil(posts.length / rpp);
        paging = {
            is_paged: num_pages > 1,
            num_pages: num_pages,
            posts_per_page: rpp
        };
        ids_by_page = _.chunk(posts, rpp);
        _.each(ids_by_page, function(arr, i){
            var url_func = archive.type === 'tag' ? nog_config.tag_archive_url : nog_config.archive_url;
            pages.push({
                relative_url: url_func(_.clone(archive), i),
                paging: _.extend({}, paging, {page: i}),
                posts: arr
            });
        });
        archive.paging = paging;
        archive.pages = pages;
    };

    var add_post_to_tag_archive = function(tag, post_id){
        var slug;
        tag = S(tag).trim().s;
        slug = S(tag).slugify().s;
        if (!_.has(tag_archives, slug)){
            tag_archives[slug] = {
                title: 'Posts tagged ' + tag,
                name: tag,
                slug: slug,
                type: 'tag',
                posts: []
            };
        }
        tag_archives[slug].posts.push(post_id);
    };

    var add_post_to_archives = function(meta, post_id){
        var date_types = {
            year: {
                title: 'Yearly Archive: ' + meta.published_at.format('YYYY'),
                slug: meta.published_at.format('YYYY')
            },
            month: {
                title: 'Monthly Archive: ' + meta.published_at.format('MMMM YYYY'),
                slug: meta.published_at.format('YYYY/MM')
            },
            day: {
                title: 'Daily Archive: ' + meta.published_at.format('LL'),
                slug: meta.published_at.format('YYYY/MM/DD')
            }
        };

        if (!_.has(archives, 'main')){
            archives.main = {
                title: 'Main Archive',
                posts:[],
                slug: '',
                type: 'main'
            };
        }
        archives.main.posts.push(post_id);
        _.each(date_types, function(data, type){
            if (!_.has(archives, data.slug)){
                archives[data.slug] = _.extend({}, data, {
                    date: moment(meta.published_at),
                    type: type,
                    posts: []
                });
                archives[data.slug].posts.push(post_id);
            }

        });


    };



    // gather the path data...
    _.each(files, function(file_path){
        var slugs = _.rest(file_path.split(path.sep));
        var id = path.basename(_.last(slugs), '.md');
        var content_filename = path.join(process.cwd(), file_path);
        var content_file_stats = fs.statSync(content_filename);
        atomic_metadata[id] = {
            id: id,
            content_filename: content_filename,
            content_file_stats: content_file_stats
        };

    });


    // gather the metadata and content defined in the content file for each atomic path...
    _.each(atomic_metadata, function(meta){
        var content = grunt.file.read(meta.content_filename);
        var front = yamlFront.loadFront(content);
        _.extend(meta, _.omit(front, '__content'), {md_content: front.__content, content: marked(front.__content)});
    });

    // normalize meta.title for each...
    _.each(atomic_metadata, function(meta, id){
        if (!_.has(meta, 'title')){
            meta.title = id;
            if (id !== 'index'){
                add_atomic_error(id, 'No title defined for ' + id);
            }
        }
    });

    // normalize meta.post_type for each...
    _.each(atomic_metadata, function(meta){
        if (_.indexOf(['post', 'page'], meta.post_type) === -1){
            meta.post_type = 'page'
        }
    });

    // normalize meta.published_at for each...
    _.each(atomic_metadata, function(meta, id){
        var published_at = _.has(meta, 'published_at') ? moment(meta.published_at, [moment.ISO_8601, 'YYYY/MM/DD', 'YYYY/MM/DD HH:mm']) : moment.invalid();
        if (! published_at.isValid()){
            published_at = moment(meta.content_file_stats.mtime);
            if ('post' === meta.post_type){
                add_atomic_error(id, 'No published_at defined for ' + id + '. This is important for posts. The published_at date has been set to the file modified time.');
            }
        }
        meta.published_at = published_at;
    });




    // deal with populating meta.parent for each...
    _.each(atomic_metadata, function(meta){
        if ('post' === meta.post_type){
            meta.parent = null;
        } else {
            meta.parent = meta.parent || null;
            meta.parent = _.has(atomic_metadata, meta.parent) ? meta.parent : null;
        }
    });

    // deal with populating meta.parents for each...
    _.each(atomic_metadata, function(meta){
        var parent;
        var parents = [];
        if ('post' === meta.post_type){
            meta.parents = [];
        } else {
            parent = meta.parent;
            while(parent){
                if (_.has(atomic_metadata, parent)){
                    parents.unshift(parent);
                    parent = atomic_metadata[parent].parent;
                } else {
                    parent = null;
                }
            }
            meta.parents = parents;
        }
    });






    // deal with the tags...
    _.each(atomic_metadata, function(meta, id){
        var tags;
        var clean;
        if (meta.post_type !== 'post'){
            meta.tags = [];
            meta.primary_tag = null;
            return;
        }
        tags = _.isString(meta.tags) ? meta.tags : '';
        tags = tags.split(',');
        clean = [];
        _.each(tags, function(tag){
            if (_.isString(tag)){
                tag = S(tag).trim().s;
                if (tag.length > 0){
                    clean.push(tag);
                }
            }
        });

        clean = _.uniq(clean);
        _.each(clean, function(tag){
            add_post_to_tag_archive(tag, id);
        });
        if (clean.length === 0 ){
            add_atomic_error(id, 'No tags found for ' + id);
        }
        meta.tags = clean;
        meta.primary_tag = _.first(meta.tags);

    });

    // deal with the archives...
    _.each(atomic_metadata, function(meta, id){
        if (meta.post_type !== 'post') return;
        add_post_to_archives(meta, id);
    });

    // sort the archives by date, descending
    _.each(archives, function(archive){
        archive.posts.sort(function(a, b){
            if (atomic_metadata[a].published_at.isBefore(atomic_metadata[b].published_at)){
                return 1;
            }
            if (atomic_metadata[a].published_at.isAfter(atomic_metadata[b].published_at)){
                return -1;
            }
            return 0;
        });
    });

    // sort the tag archives by date, descending
    _.each(tag_archives, function(archive){
        archive.posts.sort(function(a, b){
            if (atomic_metadata[a].published_at.isBefore(atomic_metadata[b].published_at)){
                return 1;
            }
            if (atomic_metadata[a].published_at.isAfter(atomic_metadata[b].published_at)){
                return -1;
            }
            return 0;
        });
    });



    // populate each atomic url...
    _.each(atomic_metadata, function(meta, id){
        if (meta.post_type === 'post'){
            meta.relative_url = nog_config.post_url(_.clone(meta), id);
        } else {
            meta.relative_url = nog_config.page_url(_.clone(meta), id);
        }
    });





    // populate each archive url, paged if necessary...
    _.each(archives, function(archive){
        populate_archive_paging(archive)

    });

    // populate each tag archive url, paged if necessary...
    _.each(tag_archives, function(archive){
        populate_archive_paging(archive)
    });


    //populate search...
    _.each(atomic_metadata, function(meta, id){
        var words = S(meta.content).stripTags().s.split(' ');
        _.each(words, function(word){
            add_search_word(word, id);
        });
    });
    _.each(search, function(arr, key){
        search[key] = _.uniq(arr);
    });








    return {
        archives: archives,
        tag_archives: tag_archives,
        atomic_metadata: atomic_metadata,
        atomic_errors: atomic_errors,
        assets: assets,
        search: search
    };



};


