/* jshint node: true */
'use strict';

var moment = require('moment');
var path = require('path');
var async = require('async');
var colors = require('colors/safe');
var sprintf = require('sprintf-js').sprintf;
var temp = require('temp').track();
var child_process = require('child_process');
var gaze = require('gaze');
var express = require('express');
var tinylr = require('tiny-lr');
var glob = require('glob');
var fs = require('fs-extra');
var _ = require('lodash');


var build = require('../build/build');
var log = require('../utils/log');

module.exports = function (options) {
    var output_directory;

    var server;
    var server_info;
    var reload_server_info;
    var site;


    var start = moment();

    var published_only = options.published_only || false;


    log(colors.blue.bold('\nStarting Nog...\n'));


    process.on('SIGINT', function() {
        temp.cleanupSync();
        process.exit(0);
    });

    async.series(
        [

            function (callback) {
                var start = moment();
                log.verbose(colors.gray.bold('\nCreating a temporary directory...\n'));
                temp.mkdir('nog-', function(err, result){
                    output_directory = result.toString();
                    log.verbose('\t', colors.gray(output_directory), '\n');
                    log.verbose('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    callback(err)
                });
            },



            //build the site...
            function (callback) {

                build.build(false, published_only, process.cwd(), output_directory, function(err, changed_uris, build_result, site_result){
                    site = site_result;
                    callback(err);
                });
            },

            // start the web server...
            function (callback) {
                var start = moment();
                var app = express();
                var prefix = '/' + site.prefix;
                log.verbose(colors.gray.bold(sprintf('\nStarting the web server on port %s...\n', options.port)));
                app.use( express.static(output_directory));

                app.listen(options.port, function (err) {
                    server_info = {
                        url: sprintf('http://localhost:%s/%s', options.port, site.prefix)
                    };
                    if (! err){
                        log.verbose(colors.gray(sprintf('\tWeb server listening on port %s. URL: %s', options.port, server_info.url)), '\n');
                        log.verbose('\t', colors.gray(sprintf('Done in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    }
                    callback(err);
                });
            },

            // Start the livereload server...
            function (callback) {
                //standard LiveReload port
                var start = moment();
                var livereload_port = 35729;
                log.verbose(colors.gray.bold(sprintf('\nStarting the live reload server on port %s...\n', livereload_port)));

                tinylr().listen(livereload_port, function(err) {
                    var info;
                    reload_server_info = {
                        port: livereload_port,
                        url: 'http://localhost:' + livereload_port,
                        err: err || null
                    };
                    if (! err){
                        log.verbose(colors.gray(sprintf('\tLive reload server listening on port %s. URL: %s', livereload_port, reload_server_info.url)), '\n');
                        log.verbose('\t', colors.gray(sprintf('Done in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    }
                    callback(err);
                });

            },

            //create the watch on the _cfg, _content, _assets and _templates directories...
            function (callback) {
                var start = moment();
                log.verbose(colors.gray.bold(sprintf('\nStarting to watch for changes in _assets, _cfg, _content and _templates.\n')));
                gaze(['_assets/**/*', '_cfg/**/*', '_content/**/*', '_templates/**/*'], function(err, watcher) {
                    if (! err){
                        log.verbose('\t', colors.gray(sprintf('Watch set. Done in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    }
                    this.on('all', function(event, filepath) {
                        build.build(false, published_only, process.cwd(), output_directory, function(err, changed_uris) {
                            var start = moment();
                            var notify = {files: _.uniq(changed_uris)};
                            log(colors.gray.bold('\nPushing changes to live reload... '), '\n');
                            async.eachSeries(changed_uris, function(uri, callback){
                                var cmd = sprintf('curl http://localhost:35729/changed?files=%s',uri);
                                child_process.exec(cmd, function (err) {
                                    if (err) log('\n', colors.red.bold(err), '\n\n');
                                    callback(null);
                                });
                            }, function(err){
                                log('\t', colors.gray(sprintf('Done in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
                            });

                        });
                    });
                    callback(null);
                });

            }


        ],

        function(err){
            if (! err){
                log('\n');
                log(colors.blue(sprintf('Reload server started on port %s: %s\n', reload_server_info.port, reload_server_info.url)));
                log(colors.gray('In order for livereload to work you must enable it in the browser. More info: https://github.com/gruntjs/grunt-contrib-watch/blob/master/docs/watch-examples.md#enabling-live-reload-in-your-html'));
                log('\n\n');
                log(colors.blue(sprintf('Local web server started on port %s: %s\n', options.port, server_info.url)));
                log(colors.gray('The local site will be rebuilt when you make changes.'));
                log('\n\n');
                log(colors.blue('To push changes to GitHub:'));
                log(colors.gray(' open a new terminal tab, then do...\n'));
                log(colors.gray('$ ./nog push\n\n'));

                log(colors.bold.blue(sprintf('Nog came alive in %ss. ^C to stop.\n\n', (moment().valueOf() - start.valueOf())/1000)));

            } else {
                temp.cleanupSync();
                log('\n', colors.red.bold(err), '\n');
                process.exit(1);
            }
            

        }
    )
};

