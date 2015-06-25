/* jshint node: true */
module.exports = function (grunt, callback) {
    'use strict';
    var async = require('async');
    var _ = require('lodash');



    var get_data_index = require('./get_data_index');
    var get_data_pages = require('./get_data_pages');
    var get_data_posts = require('./get_data_posts');
    var get_data_search = require('./get_data_search');
    var get_default_options = require('./get_default_options');


    var options = _.extend(get_default_options(grunt), grunt.config.get('nog'));


    var data = {
        site: options,
        index: null,
        pages: null,
        posts: null,
        archives: null,
        search: null
    };

    grunt.verbose.subhead('Gathering data...');

    async.series(
        [


            function(callback){
                get_data_index(grunt, options, function(err, result){
                    data.index = result.index;
                    callback(err);
                });
            },

            function(callback){
                get_data_pages(grunt, options, function(err, result){
                    data.pages = result.pages;
                    callback(err);
                });
            },

            function(callback){
                get_data_posts(grunt, options, function(err, result){
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
            }
        ],
        function(err){
            callback(err, data);
        }
    );

};


