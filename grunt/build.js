/* jshint node: true */
module.exports = function (grunt, callback) {
    'use strict';
    var async = require('async');
    var path = require('path');
    var rimraf = require('rimraf');
    var swig = require('swig');
    var _ = require('lodash');



    var files = grunt.file.expand('content/**/index.twig');
    var site = grunt.config.get('nog');
    var metadata = {};


    _.each(files, function(file_path){
        var meta;
        var slugs = file_path.split(path.sep);
        var template_filename = path.join(process.cwd(), file_path);
        var template_path = path.dirname(template_filename);
        var relative_path = path.dirname('/' + _.rest(slugs).join('/'));
        var json_path = path.join(template_path, 'meta.json');

        var defined_meta = grunt.file.exists(json_path) ? grunt.file.readJSON(json_path) : {};

        meta = {
            template_filename: template_filename,
            template_path: template_path,
            relative_path: relative_path
        };

        _.extend(meta, defined_meta, meta);
        metadata[relative_path] = meta;
    });



    async.series(
        [
            function(callback){
                var p = path.join(process.cwd(), '_site');
                rimraf(p, callback);
            },
            function(callback){
                async.each(metadata, function(meta, callback){
                    swig.renderFile(meta.template_filename, {site: site, meta: meta}, function (err, output) {
                        var p = path.join(process.cwd(), '_site', meta.relative_path, 'index.html');
                        if (err) return callback(err);
                        grunt.file.write(p, output);
                        callback();
                    });
                }, callback);
            }
        ], callback
    );







};


