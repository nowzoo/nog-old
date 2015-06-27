/* jshint node: true */
module.exports = function (grunt, options, callback) {
    'use strict';
    var async = require('async');
    var fs = require('fs');
    var path = require('path');
    var _ = require('lodash');




    var read_content = require('./read_content');

    var file_list;
    var index;

    var lib_path = path.dirname(__dirname);
    var content_path_exists = true;

    grunt.verbose.writeln('Gathering home page data.');

    async.series(
        [
            // Read the content/index directory
            function(callback){
                var p = path.join(process.cwd(), 'content', 'index');
                grunt.verbose.writeln('Reading the content/index directory...');
                fs.readdir(p, function(err, result){
                    file_list = result;
                    callback(err);
                });
            },

            // Create the posts...
            function(callback){
                var filename = null;
                if (_.indexOf(file_list, 'index.md') !== -1){
                    filename = path.join(process.cwd(), 'content', 'index', 'index.md');
                } else {
                    if (_.indexOf(file_list, 'index.html') !== -1){
                        filename = path.join(lib_path, 'content', 'index', 'index.md');
                    } else {
                        filename = path.join(lib_path, 'initial_site_files', 'content', 'index', 'index.md');
                        content_path_exists = false;
                    }
                }
                read_content(grunt, filename, 'index', function(err, post){
                    if (! err && post){
                        index = post;
                    }
                    callback(err);
                });


            },
            //Set an error if ! content_path_exists...
            function (callback) {
                if (! content_path_exists){
                    index.has_error = true;
                    index.errors.push('There was no index.md or index.html file found at content/index. Substituting default content for home page.');
                }
                callback(null);
            },

            //Set the path...
            function (callback) {
                index.path = '';
                callback(null);
            }
        ],
        function(err){
            callback(err, {
                index: index
            });
        }
    );




};


