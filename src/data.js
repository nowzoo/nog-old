'use strict';
var async = require('async');
var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var glob = require('glob');
var fs = require('fs-extra');
var S = require('string');
var marked = require('marked');
var yamlFront = require('yaml-front-matter');
var sprintf = require('sprintf-js').sprintf;

var config = require('./config');
var contents = require('./contents');
var templates = require('./templates');
var atomic = require('./atomic');


var read = module.exports.read = function(input_directory, is_build_public, callback){
    var data = {
        input_directory: input_directory,
        content_directory: path.join(input_directory, '_content'),
        is_build_public: is_build_public,
    };

    async.series(
        [

            function(callback){
                templates.read(input_directory, function(err, result){
                    data.templates = result;
                    callback(err);
                });
            },
            function(callback){
                config.read(input_directory, function(err, result){
                    data.config = result;
                    callback(err);
                });
            },
            function(callback){
                contents.read(data, function(err, result, lint){
                    data.contents = result;
                    callback(err);
                });
            }

        ],
        function (err) {
            data.archives = contents.get_archives(data);
            data.search_index = contents.get_search_index(data);
            _.each(data.contents, function(content){
                atomic.populate_data(data, content);
            });
            callback(err, data);
        }
    );
};









