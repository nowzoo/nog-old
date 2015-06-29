/* jshint node: true */
module.exports.start = function (grunt, callback) {
    'use strict';

    var path = require('path');
    var async = require('async');
    var sprintf = require('sprintf-js').sprintf;
    var temp = require('temp').track();
    var child_process = require('child_process');
    var gaze = require('gaze');

    var get_data = require('./get_data');
    var build = require('./build');


    var new_data = {};
    var process_data;
    var temp_dir;
    var server;
    var server_info;
    var reload_server;
    var reload_server_info;

    var data;

    process.on('SIGINT', function() {
        reload_server.kill();
        server.kill();
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
                    new_data.directory = result.toString();
                    callback(err)
                });
            },

            // start the web server...
            function (callback) {
                var p = path.join(process.cwd(), 'nog', 'serve.js');
                var verbose = grunt.option('verbose') ? 'true' : 'false';
                var port = grunt.option('port') || 3000;
                var site_prefix = grunt.config('nog.site_prefix');
                var started = false;
                if (site_prefix.length == 0) site_prefix = '/';
                grunt.log.write('Starting an express server... ');
                server = child_process.spawn(
                    p,
                    [site_prefix, port, verbose],
                    {stdio: ['ipc'], cwd: new_data.directory}
                );
                server.on('message', function(m) {
                    if('started' === m.message){
                        server_info = m;
                        if (! m.err) grunt.log.ok();
                        callback(m.err);
                    }

                });

            },

            // Start the liverelod server...
            function (callback) {
                var p = path.join(process.cwd(), 'nog', 'livereload.js');
                var verbose = grunt.option('verbose') ? 'true' : 'false';
                var port = grunt.option('port') || 3000;
                var site_prefix = grunt.config('nog.site_prefix');
                var started = false;
                if (site_prefix.length == 0) site_prefix = '/';
                grunt.log.write('Starting a livereload server... ');
                reload_server = child_process.spawn(
                    p,
                    [site_prefix, port, verbose],
                    {stdio: ['ipc'], cwd: new_data.directory}
                );
                reload_server.on('message', function(m) {
                    if('started' === m.message){
                        reload_server_info = m;
                        if (! m.err) grunt.log.ok();
                        return callback(m.err);
                    }
                    if('site_file_changed' === m.message){
                        if (! m.err) grunt.log.ok(m.filepath, 'changed');
                        else grunt.log.error(error);
                        return callback(m.err);
                    }

                });

            },

            //build the site...
            function (callback) {
                grunt.log.write('Building the site... ');
                build(grunt, new_data.directory, function (err) {
                    if (! err) grunt.log.ok();
                    callback(err);
                });
            },
            //create the watch on the _content, _assets and _templates directories...
            function (callback) {
                gaze(['_assets/**/*', '_content/**/*', '_templates/**/*'], function(err, watcher) {
                    this.on('all', function(event, filepath) {
                        grunt.log.write('Building the site... ');
                        build(grunt, new_data.directory, function (err) {
                            if (! err) grunt.log.ok();
                            else grunt.log.error(err);
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
