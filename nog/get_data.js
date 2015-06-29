/* jshint node: true */
module.exports = function (grunt, callback) {
    'use strict';
    var async = require('async');
    var _ = require('lodash');



    var get_data_index = require('./get_data_index');
    var get_data_pages = require('./get_data_pages');
    var get_data_posts = require('./get_data_posts');
    var get_data_search = require('./get_data_search');


    var options = grunt.config.get('nog');


    var data = {
        site: options,
        index: null,
        pages: null,
        posts: null,
        archives: null,
        search: null,
        filenames: []
    };
    var filenames = [];

    grunt.verbose.subhead('Gathering data...');

    async.series(
        [


            function(callback){
                get_data_index(grunt, options, filenames, function(err, result){
                    data.index = result.index;
                    callback(err);
                });
            },

            function(callback){
                get_data_pages(grunt, options, filenames, function(err, result){
                    data.pages = result.pages;
                    callback(err);
                });
            },

            function(callback){
                get_data_posts(grunt, options, filenames, function(err, result){
                    data.posts = result.posts;
                    data.archives = result.archives;
                    callback(err);
                });
            },
            function(callback){
                var content = [].concat(_.values(data.posts), _.values(data.pages), [data.index]);
                get_data_search(grunt, content, function(err, result){
                    data.search = result;
                    callback(err);
                });
            },
            function(callback){
                var assets = grunt.file.expand(['_assets/**/*.*']);
                var assets_copy_to_subdir = grunt.config('nog.assets_copy_to_subdir');
                var prefix = '';
                if (assets_copy_to_subdir !== false){
                  if (_.isString(assets_copy_to_subdir)){
                      prefix = copy_to_site_root.trim() + '/';
                  } else if (assets_copy_to_subdir === true) {
                      prefix = 'assets/';
                  }
                }
                _.each(assets, function (p) {
                    filenames.push(p.replace(/^_assets\//, prefix));
                });
                data.filenames = filenames;
                callback();
            }
        ],
        function(err){
            filenames.push('search.json');
            callback(err, data);
        }
    );

};
