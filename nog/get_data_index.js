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
            // Read the _content/index directory
            function(callback){
                var p = path.join(process.cwd(), '_content', 'index');
                grunt.verbose.writeln('Reading the _content/index directory...');
                fs.readdir(p, function(err, result){
                    file_list = result;
                    callback(err);
                });
            },

            // Create the posts...
            function(callback){
                var filename = null;
                if (_.indexOf(file_list, 'index.md') !== -1){
                    filename = path.join(process.cwd(), '_content', 'index', 'index.md');
                } else {
                    if (_.indexOf(file_list, 'index.html') !== -1){
                        filename = path.join(lib_path, '_content', 'index', 'index.html');
                    } else {
                        content_path_exists = false;
                    }
                }
                if (! content_path_exists){
                  index = {
                    title: 'Home Page',
                    errors: ['There was no index.md or index.html file found at _content/index.']
                  };
                  return callback(null);
                }
                read_content(grunt, filename, 'index', function(err, post){
                    if (! err && post){
                        index = post;
                    }
                    callback(err);
                });


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
