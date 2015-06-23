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


    var site_path = path.join(process.cwd(), '_site');





    async.series(
        [
            function(callback){
                rimraf(site_path, callback);
            },
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
                    template = path.join(process.cwd(),'templates', template);
                    swig.renderFile(template, data, function (err, output) {
                        var p = path.join(process.cwd(), '_site', meta.relative_url, 'index.html');
                        if (err) return callback(err);
                        grunt.file.write(p, output);
                        callback();
                    });
                }, callback);
            },
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
                        template = path.join(process.cwd(),'templates', template);
                        swig.renderFile(template, data, function (err, output) {
                            var p = path.join(process.cwd(), '_site', page.relative_url, 'index.html');
                            if (err) return callback(err);
                            grunt.file.write(p, output);
                            callback();
                        });
                    }, callback);

                }, callback);
            },
            function(callback){
                var p = path.join(process.cwd(), 'assets');
                fs.readdir('assets', function(err, files){

                    async.each(files, function(filename, callback){
                        var src = path.join(process.cwd(), 'assets',filename );
                        var dst = path.join(process.cwd(), '_site',filename );
                        ncp(src, dst, callback);
                    }, callback);
                });

            }
        ], callback
    );







};


