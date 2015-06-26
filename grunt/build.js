/* jshint node: true */
module.exports = function (grunt, data, callback) {
    'use strict';
    var fs = require('fs');
    var async = require('async');
    var path = require('path');
    var rimraf = require('rimraf');
    var swig = require('swig');
    var ncp = require('ncp').ncp;
    var moment = require('moment');
    var _ = require('lodash');
    var exec = require('child_process').exec;


    grunt.verbose.subhead('Building site...');

    var orig_dir = process.cwd();
    var _site_dir = path.join(orig_dir, '_site');
    var old_files;

    async.series(
        [


            // Make sure we're on master
            function(callback){
                var cmd = 'git checkout master';
                grunt.verbose.writeln('Checking out master: %s', cmd);
                exec(cmd, callback);
            },


            //get the old files...
            function(callback){
                grunt.verbose.writeln('Reading old files...');
                fs.readdir(_site_dir, function(err, result){
                    old_files = result;
                    callback(null);
                });
            },

            //remove the old files
            //

            //remove the old files...
            function(callback){

                var keep = ['README.md', '.gitignore', '.git'];
                grunt.verbose.writeln('Deleting old files...');
                async.each(old_files, function(name, callback){
                    var p = path.join(_site_dir, name);
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
                    var template = path.join(process.cwd(), 'templates', post.type + '.twig');
                    var passed = {
                        data: data,
                        post: post
                    };
                    swig.renderFile(template, passed, function (err, output) {
                        var p = path.join(_site_dir, post.path, 'index.html');
                        if (err) return callback(err);
                        grunt.file.write(p, output);
                        grunt.verbose.writeln('Wrote _site/%s.', post.path);
                        callback();
                    });
                }, callback);
            },


            //write the archives
            function(callback){
                var template = path.join(process.cwd(), 'templates', 'archive.twig');
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
                            var p = path.join(_site_dir, page.path,  'index.html');
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
                var src = path.join(process.cwd(), 'assets' );
                var dst = path.join(process.cwd(), '_site', 'assets' );
                grunt.verbose.writeln('Copying assets...');
                ncp(src, dst, callback);
            },

            //write search...
            function(callback){
                var p = path.join(_site_dir, 'search.json');
                grunt.verbose.writeln('Writing /%s...', 'search.json');
                grunt.file.write(p, JSON.stringify(data.search));
                callback();
            },

            // switch to _site directory...
            function(callback){
                process.chdir(_site_dir);
                grunt.verbose.writeln('Changed working directory to %s', _site_dir);
                callback();
            },

            // Checkout gh-pages branch
            function(callback){
                var cmd = 'git checkout gh-pages';
                grunt.log.writeln('Checkout gh-pages: %s', cmd);
                exec(cmd, callback);
            },

            // Add -A
            function(callback){
                var cmd = 'git add -A';
                grunt.log.writeln('Add: %s', cmd);
                exec(cmd, callback);
            },
            // switch to orig directory...
            function(callback){
                process.chdir(orig_dir);
                grunt.verbose.writeln('Changed working directory to %s', orig_dir);
                callback();
            }



        ], function(err){
            process.chdir(orig_dir);
            callback(err);
        }
    );







};

