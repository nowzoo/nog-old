/* jshint node: true */
var async = require('async');
var temp = require('temp').track();
var child_process = require('child_process');




module.exports.start = function (grunt, callback) {
    'use strict';


    var new_data = {};
    var process_data;
    var temp_dir;
    var server;

    process.on('SIGINT', function() {
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

            // start the server...
            function (callback) {
                grunt.log.writeln('Starting an express server... ');
                server = child_process.execFile('./serve', [], {cwd: new_data.directory, stdio: 'inherit'});

                //console.log('server.pid', server);
                callback();
            }
        ],

        function(err){
            if (err) {
                grunt.log.error(err);
                callback(err);

            }
        }
    )
};
