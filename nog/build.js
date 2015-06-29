#!/usr/bin/env node
/* jshint node: true */
module.exports = function (grunt, target_dir, callback) {
    'use strict';
    var fs = require('fs');
    var async = require('async');
    var path = require('path');
    var rimraf = require('rimraf');
    var swig = require('swig');
    var ncp = require('ncp').ncp;
    var moment = require('moment');
    var _ = require('lodash');

    var get_data = require('./get_data');




    var orig_dir = process.cwd();
    var old_files;
    var data;

    async.series(
        [
            //get the old files...
            function(callback){
                grunt.verbose.writeln('Gathering data...');
                get_data(grunt, function (err, result) {
                    data = result;
                    callback(err);
                });
            },

            //get the old files...
            function(callback){
                grunt.verbose.writeln('Reading old files...');
                fs.readdir(target_dir, function(err, result){
                    old_files = result;
                    callback(null);
                });
            },

            //@TODO get the new paths, then delete only those files that  no longer exist...

            //remove the old files...
            function(callback){
                var keep = ['.gitignore', '.git', 'updated.json'];
                grunt.verbose.writeln('Deleting old files...');
                async.each(old_files, function(name, callback){
                    var p = path.join(target_dir, name);
                    if (_.indexOf(keep, name) !== -1) return callback();
                    if (name.indexOf('.') === 0) return callback();
                    grunt.verbose.writeln('Deleting: %s', name);
                    rimraf(p, callback);
                }, callback);
            },



            //write the atomic content...
            function(callback){
                var content = [].concat(data.index, _.values(data.posts), _.values(data.pages));
                grunt.verbose.writeln('Writing atomic content...');
                async.each(content, function(post, callback){
                    var template = path.join(process.cwd(), '_templates', post.type + '.twig');
                    var passed = {
                        site: data.site,
                        data: data,
                        post: post
                    };
                    swig.renderFile(template, passed, function (err, output) {
                        var p = path.join(target_dir, post.path, 'index.html');
                        if (err) return callback(err);
                        grunt.file.write(p, output);
                        grunt.verbose.writeln('Wrote /%s.', post.path);
                        callback();
                    });
                }, callback);
            },


            //write the archives
            function(callback){
                var template = path.join(process.cwd(), '_templates', 'archive.twig');
                var archives = [].concat(
                    data.archives.main,
                    _.values(data.archives.tags),
                    _.values(data.archives.date)
                );
                grunt.verbose.writeln('Writing archives...');
                async.each(archives, function(archive, callback){
                    async.each(archive.pages, function(page, callback){
                        var passed = {
                            data: data,
                            archive: archive,
                            page: page
                        };
                        swig.renderFile(template, passed, function (err, output) {
                            var p = path.join(target_dir, page.path,  'index.html');
                            if (err) return callback(err);
                            grunt.file.write(p, output);
                            grunt.verbose.writeln('_site/%s written.', page.path);
                            callback();
                        });
                    }, callback);
                }, callback);
            },


            //write the assets
            function(callback){
                var src = path.join(process.cwd(), '_assets' );
                var dst = target_dir;
                var assets_copy_to_subdir = grunt.config('nog.assets_copy_to_subdir');
                if (assets_copy_to_subdir !== false){
                  if (_.isString(assets_copy_to_subdir)){
                    dst = path.join(dst, copy_to_site_root.trim());
                  } else if (assets_copy_to_subdir === true) {
                    dst = path.join(dst, 'assets' );
                  }
                }
                grunt.verbose.writeln('Copying assets...');
                ncp(src, dst, callback);
            },

            //write search...
            function(callback){
                var p = path.join(target_dir, 'search.json');
                grunt.verbose.writeln('Writing /%s...', 'search.json');
                grunt.file.write(p, JSON.stringify(data.search));
                callback();
            },

            //write updated...
            function(callback){
                var p = path.join(target_dir, 'updated.json');
                grunt.verbose.writeln('Writing /%s...', 'updated.json');
                grunt.file.write(p, JSON.stringify({updated: moment()}));
                callback();
            }



        ], callback
    );

};
