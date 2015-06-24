/* jshint node: true */
module.exports = function (grunt, callback) {
    'use strict';
    var fs = require('fs');
    var async = require('async');
    var path = require('path');
    var rimraf = require('rimraf');
    var swig = require('swig');
    var ncp = require('ncp').ncp;
    var _ = require('lodash');

    var gather_metadata = require('./gather_metadata');



    var site = grunt.config.get('nog');
    var metadata = gather_metadata(grunt);
    var files;



    async.series(
        [
            //read the old...
            function(callback){
                fs.readdir(process.cwd(), function(err, result){
                    files = result();
                    callback(err);
                });
            },

            //delete the old...
            function(callback){
                var keep = ['_nog', 'README.md', 'package.json', 'LICENSE', 'Gruntfile.js'];
                async.each(files, function(name, callback){
                    if (_.indexOf(keep, name) !== -1) return callback(null);
                    if (name.indexOf('.') === 0) return callback(null);
                    rimraf(path.join(process.cwd(), name), callback);
                }, callback)
            },

            //write the atomic URLs
            function(callback){
                async.each(metadata.atomic_metadata, function(meta, callback){
                    var template;
                    var data = {
                        post: meta,
                        current_post: meta,
                        site: site,
                        posts: metadata.atomic_metadata,
                        archives: metadata.archives,
                        tag_archives: metadata.tag_archives
                    };
                    if (meta.post_type === 'post'){
                        template = _.has(site, 'post_template') ? site.post_template : 'post.twig';

                    } else {
                        template = _.has(site, 'page_template') ? site.page_template : 'page.twig';
                    }
                    template = _.has(meta, 'template') ? meta.template : template;
                    template = path.join(process.cwd(), '_nog', 'templates', template);
                    swig.renderFile(template, data, function (err, output) {
                        var p = path.join(process.cwd(), meta.relative_url, 'index.html');
                        if (err) return callback(err);
                        grunt.file.write(p, output);
                        callback();
                    });
                }, callback);
            },

            //write the archive URLs
            function(callback){
                async.each([].concat(metadata.archives, metadata.tag_archives), function(archive, callback){
                    async.each(archive.pages, function(page, callback){
                        var template;
                        var data = {
                            post: null,
                            current_post: null,
                            site: site,
                            posts: metadata.atomic_metadata,
                            archives: metadata.archives,
                            tag_archives: metadata.tag_archives,
                            archive: archive,
                            page: page
                        };

                        template = _.has(site, 'archive_template') ? site.archive_template : 'archive.twig';
                        template = _.has(archive, 'template') ? archive.template : template;
                        template = path.join(process.cwd(), '_nog', 'templates', template);
                        swig.renderFile(template, data, function (err, output) {
                            var p = path.join(process.cwd(), page.relative_url, 'index.html');
                            if (err) return callback(err);
                            grunt.file.write(p, output);
                            callback();
                        });
                    }, callback);

                }, callback);
            },

            //write the assets
            function(callback){
                var src = path.join(process.cwd(), 'nog', 'assets' );
                var dst = path.join(process.cwd(), 'assets' );
                ncp(src, dst, callback);
            },
            function(callback){
                var p = path.join(process.cwd(), 'search.json');
                fs.writeFile(p, JSON.stringify(metadata.search), callback);
            }
        ], callback
    );







};


