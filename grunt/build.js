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

    async.series(
        [


            // Make sure we're on master
            function(callback){
                var cmd = 'git checkout master';
                grunt.verbose.writeln('Checking out master: %s', cmd);
                exec(cmd, callback);
            },


            //delete the old _site...
            function(callback){
                var p = path.join(process.cwd(), '_site');
                grunt.verbose.writeln('Removing _site...');
                rimraf(p, callback);
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
                        var p = path.join(process.cwd(), '_site', post.path, 'index.html');
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
                            var p = path.join(process.cwd(), '_site', page.path,  'index.html');
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
            function(callback){
                var p = path.join(process.cwd(), '_site', 'search.json');
                grunt.verbose.writeln('Writing /%s...', 'search.json');
                grunt.file.write(p, JSON.stringify(data.search));
                callback();
            }



        ], function(err){

            callback(err);
        }
    );







};


