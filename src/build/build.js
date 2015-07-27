'use strict';
var async = require('async');
var moment = require('moment');
var sprintf = require('sprintf-js').sprintf;
var colors = require('colors/safe');

var log = require('../utils/log');
var ensure_output_directory_exists = require('./ensure_output_directory_exists');
var site_json_read = require('../site_json/read');
var remove_old_files = require('./remove_old_files');
var atomic_read_all = require('../atomic/read_all');
var atomic_populate_all = require('../atomic/populate_all');
var archives_create = require('../archives/create');
var write_atomic = require('./write_atomic');
var write_archives = require('./write_archives');
var copy_assets = require('./copy_assets');
var clear_require_cache = require('../pluggable/clear_require_cache');
var require_pluggable = require('../pluggable/require_pluggable');

var build = module.exports.build = function(is_build_public, published_only, input_directory, output_directory, callback){

    var start = moment();
    var changed_uris = [];
    var build = {
        public: is_build_public,
        published_only: published_only,
        input_directory: input_directory,
        output_directory: output_directory
    };

    var site;
    var contents;
    var archives;

    log.verbose(colors.gray.bold(sprintf('\nBuilding the site...\n')));
    log.verbose(colors.gray(sprintf('\tPublic build: %s\n', is_build_public)));
    log.verbose(colors.gray(sprintf('\tPublished only build: %s\n', published_only)));
    log.verbose(colors.gray(sprintf('\tInput directory: %s\n', input_directory)));
    log.verbose(colors.gray(sprintf('\tOutput directory: %s\n', output_directory)));
    async.series(
        [
            //make sure the directory exists and is a directory...
            function(callback){
                ensure_output_directory_exists(build, callback);
            },

            //get the site ...
            function(callback){
                site_json_read(build, function(err, result){
                    site = result;
                    callback(err);
                });
            },

            //clear_require_cache ...
            function(callback){
                clear_require_cache(build, callback);
            },
            //require_pluggable ...
            function(callback){

                require_pluggable(build, function(err, pluggable){
                    build.render_markdown = require('../render/markdown');
                    build.render_template = require('../render/template');
                    callback(err);
                });
            },

            //get the contents ...
            function(callback){
                atomic_read_all(build, function(err, result){
                    contents = result;
                    callback(err);
                });
            },
            //populate the contents ...
            function(callback){
                atomic_populate_all(build, site, contents, callback);
                archives = archives_create(site, contents)
            },



            //delete the existing files...
            function(callback){
                remove_old_files(build, changed_uris, callback);
            },

            //write the atomic contents...
            function(callback){
                write_atomic(build, site, contents, changed_uris, callback);
            },
            //write the archives...
            function(callback){
                write_archives(build, site, archives, changed_uris, callback);
            },

            //copy _assets...
            function(callback){
                copy_assets(build, site, changed_uris, callback);
            }
        ],
        function (err) {
            if (! err){
                log.verbose(colors.gray.bold(sprintf('\nSite built in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
            } else {
                console.log(err);
            }
            callback(err, changed_uris, build, site);
        }
    );
};