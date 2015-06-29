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




    grunt.verbose.subhead('Building site...');

    var orig_dir = process.cwd();
    var _site_dir = path.join(orig_dir, '_site');
    var old_files;

    async.series(
        [

            //get the old files...
            function(callback){
                grunt.verbose.writeln('Reading old files...');
                fs.readdir(_site_dir, function(err, result){
                    old_files = result;
                    callback(null);
                });
            },


            //remove the old files...
            function(callback){
                var keep = ['.gitignore', '.git', 'updated.json'];
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
                    var template = path.join(process.cwd(), '_templates', post.type + '.twig');
                    var passed = {
                        site: data.site,
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
                var src = path.join(process.cwd(), '_assets' );
                var dst = path.join(process.cwd(), '_site' );
                var assets_copy_to_subdir = grunt.config('nog.assets_copy_to_subdir');
                console.log(assets_copy_to_subdir);
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
                var p = path.join(_site_dir, 'search.json');
                grunt.verbose.writeln('Writing /%s...', 'search.json');
                grunt.file.write(p, JSON.stringify(data.search));
                callback();
            },

            //write search...
            function(callback){
                var p = path.join(_site_dir, 'updated.json');
                grunt.verbose.writeln('Writing /%s...', 'updated.json');
                grunt.file.write(p, JSON.stringify({updated: moment()}));
                callback();
            }



        ], function(err){
            process.chdir(orig_dir);
            callback(err);
        }
    );

};