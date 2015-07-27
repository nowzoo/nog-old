/* jshint node: true */
var _ = require('lodash');
var async = require('async');
var path = require('path');
var glob = require('glob');
var fs = require('fs-extra');
var sprintf =  require('sprintf-js').sprintf;
module.exports = function(input_directory, output_directory, is_build_public, published_only, callback){
    "use strict";

    var nog = {
        build: {
            input_directory: input_directory,
            output_directory: output_directory,
            is_build_public: is_build_public,
            published_only: published_only
        },
        site: {},
        pluggable: {},
        lint: {}
    };

    var site_json_read = require('./site_json_read');
    var clear_require_cache = require('../pluggable/clear_require_cache');
    var require_pluggable = require('../pluggable/require_pluggable');



    async.series(
        [
            function(callback){
                var lint = {};
                site_json_read(input_directory, lint, function(err, result){
                    nog.site = result;
                    nog.lint.site_json = lint;
                    callback(err);
                });
            },

            function(callback){
                clear_require_cache(input_directory, callback)
            },

            function(callback){
                var lint = {};
                require_pluggable(input_directory, lint, function(err, pluggable){
                    log.lint.pluggable = lint;
                    if (err) {
                        nog.pluggable = {};
                    } else {
                        nog.pluggable = pluggable;
                    }
                    callback(null);
                });
            }
        ],
        function(err){
            callback(err, nog);
        }
    );

};

