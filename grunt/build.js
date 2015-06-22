/* jshint node: true */
module.exports = function (grunt, callback) {
    'use strict';
    var async = require('async');
    var path = require('path');
    var rimraf = require('rimraf');
    var swig = require('swig');
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
                    swig.renderFile(meta.content_filename, {site: site, meta: meta}, function (err, output) {
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
                        swig.renderFile('templates/archive.twig', {site: site, archive: archive, page: page, content: metadata.atomic_metadata}, function (err, output) {
                            var p = path.join(process.cwd(), '_site', page.relative_url, 'index.html');
                            if (err) return callback(err);
                            grunt.file.write(p, output);
                            callback();
                        });
                    }, callback);

                }, callback);
            }
        ], callback
    );







};


