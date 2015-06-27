/* jshint node: true */
module.exports = function (grunt, options, callback) {
    'use strict';
    var async = require('async');
    var fs = require('fs');
    var path = require('path');
    var _ = require('lodash');


    var get_data_post_archives = require('./get_data_post_archives');


    var read_content = require('./read_content');

    var file_list;
    var archives;
    var posts = {};

    var posts_path = path.join(process.cwd(), 'nog_content', 'posts');

    grunt.verbose.writeln('Gathering posts data.');

    async.series(
        [
            // Read the nog_content/posts directory
            function(callback){
                grunt.verbose.writeln('Reading the nog_content/posts directory...');
                fs.readdir(posts_path, function(err, result){
                    file_list = result;
                    callback(err);
                });
            },

            // Create the posts...
            function(callback){
                async.each(file_list, function(filename, callback){
                    var p = path.join(posts_path, filename);
                    read_content(grunt, p, 'post', function(err, post){
                        if (! err && post){
                            posts[post.id] = post;
                        }
                        callback(err);
                    })

                }, callback)
            },

            function (callback) {
                get_data_post_archives(grunt, options, posts, function(err, result){
                    archives = result;
                    callback(err);
                })
            },
            //get the path...
            function (callback) {
                _.each(posts, function(post, id){
                    grunt.verbose.writeln('Normalizing the path for %s...', id);
                    post.path = options.atomic_path(post, id);
                });
                callback(null);
            }
        ],
        function(err){
            callback(err, {
                posts: posts,
                archives: archives
            });
        }
    );




};
