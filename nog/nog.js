/* jshint node: true */
module.exports.start = function (grunt, callback) {
    'use strict';

    var path = require('path');
    var async = require('async');
    var sprintf = require('sprintf-js').sprintf;
    var temp = require('temp').track();
    var child_process = require('child_process');
    var gaze = require('gaze');
    var express = require('express');
    var tinylr = require('tiny-lr');



    var get_data = require('./get_data');
    var build = require('./build');


    var site_serve_directory;
    var process_data;
    var temp_dir;
    var server;
    var server_info;
    var reload_server;
    var reload_server_info;

    var data;

    process.on('SIGINT', function() {
	    callback();
	});

    async.series(
        [
            function (callback) {
                grunt.log.write('Creating a temporary directory... ');
                temp.mkdir('nog-', function(err, result){
                    if (err) return callback(err);
                    temp_dir = result;
                    grunt.log.writeln(temp_dir);
                    site_serve_directory = result.toString();
                    callback(err)
                });
            },

            // start the web server...
            function (callback) {
                var verbose = grunt.option('verbose') ? 'true' : 'false';
                var port = grunt.option('port') || 3000;
                var site_prefix = grunt.config('nog.site_prefix');
                var started = false;
                var app = express();
                grunt.log.write('Starting the localhost web server... ');
                if (site_prefix.length == 0) site_prefix = '/';

                app.use(site_prefix, express.static(site_serve_directory));

                app.listen(port, function (err) {
                    server_info = {
                        port: port,
                        url: 'http://localhost:' + port + site_prefix,
                        err: err || null
                    };
                    if (! err) grunt.log.ok();
                    callback(err);
                });
            },

            // Start the liverelod server...
            function (callback) {
                //standard LiveReload port
                var livereload_port = 35729;
                grunt.log.write('Starting the localhost livereload server... ');

                tinylr().listen(livereload_port, function(err) {
                    var info;
                    reload_server_info = {
                        port: livereload_port,
                        url: 'http://localhost:' + livereload_port,
                        err: err || null
                    };
                    if (! err) grunt.log.ok();
                    callback(err);
                });

            },

            //build the site...
            function (callback) {
                grunt.log.write('Building the site... ');
                build(grunt, site_serve_directory, function (err) {
                    if (! err) grunt.log.ok();
                    callback(err);
                });
            },
            //create the watch on the _content, _assets and _templates directories...
            function (callback) {
                gaze(['_assets/**/*', '_content/**/*', '_templates/**/*'], function(err, watcher) {
                    this.on('all', function(event, filepath) {
                        grunt.log.write('Building the site... ');
                        build(grunt, site_serve_directory, function (err) {
                            if (! err) grunt.log.ok();
                            else grunt.log.error(err);
                        });
                    });

                });
                callback(null);
            },
            //watch the site_serve_directory and push changes to lr...
            function (callback) {
                var site_prefix = grunt.config('nog.site_prefix');
                if (site_prefix.length == 0) site_prefix = '/';
                gaze([site_serve_directory + '/**/*'], function(err, watcher) {
                    this.on('all', function(event, filepath) {
                        var livereload_port = 35729;
                        var rel = path.join(site_prefix, path.relative(site_serve_directory, filepath));
                        var cmd = sprintf('curl http://localhost:%s/changed?files=%s', livereload_port, rel);
                        grunt.verbose.writeln('%s: %s', event, rel);
                        child_process.exec(cmd, function (err) {
                            if(err) grunt.log.error(err);
                        });

                    });

                });
                callback(null);
            }

        ],

        function(err){
            if (err) {
                grunt.log.error(err);
                return callback(err);

            }
        }
    )
};
