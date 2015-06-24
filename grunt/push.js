/* jshint node: true */
module.exports = function (grunt, done) {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var exec = require('child_process').exec;

    var moment = require('moment');
    var async = require('async');
    var ncp = require('ncp').ncp;
    var rimraf = require('rimraf');
    var _ = require('lodash');
    var colors = require('colors/safe');
    var sprintf = require('sprintf-js').sprintf;




    var file_list;



    console.log(colors.black.bold('Pushing...'));

    async.series(
        [
            // Make sure we're on the master branch...
            function(callback){
                exec(
                    'git checkout master',
                    function (error, stdout) {
                        console.log(colors.gray(stdout));
                        callback(error);
                    }
                );
            },
            // Add all the changes...
            function(callback){
                exec(
                    'git add -A',
                    function (error, stdout) {
                        console.log(colors.gray(stdout));
                        callback(error);
                    }
                );
            },
            // Commit the changes...
            function(callback){
                exec(
                    sprintf('git commit -m "automatic nog commit %s"', moment().toISOString()),
                    function (error, stdout) {
                        console.log(colors.gray(stdout));
                        callback(error);
                    }
                );
            },
            // Push the changes...
            function(callback){
                exec(
                    'git push origin master',
                    function (error, stdout) {
                        console.log(colors.gray(stdout));
                        callback(error);
                    }
                );
            },

            // Checkout gh-pages...
            function(callback){
                exec(
                    'git checkout gh-pages',
                    function (error, stdout) {
                        console.log(colors.gray(stdout));
                        callback(error);
                    }
                );
            },

            // read the files in gh-pages...
            function(callback){
                fs.readdir(process.cwd(), function(err, result){
                    file_list = result;
                    callback(err);
                });
            },

            function(callback){
                var keep = [ '_site', 'node_modules' ];
                async.each(file_list, function(filename, callback){
                    if (_.indexOf(keep, filename) >= 0) return callback();
                    if (filename.indexOf('.') === 0) return callback();
                    rimraf(path.join(process.cwd(),filename), callback);
                }, callback);
            },
            function(callback) {
                var p = path.join(process.cwd(), '_site');
                fs.readdir(p, function (err, result) {
                    file_list = result;
                    callback(err);
                });
            },
            function(callback){
                async.each(file_list, function(filename, callback){
                    var src = path.join(process.cwd(), '_site', filename);
                    var dst = path.join(process.cwd(), filename);
                    ncp(src, dst, callback);
                }, callback);
            },
            // Add all the changes...
            function(callback){
                exec(
                    'git add -A',
                    function (error, stdout) {
                        console.log(colors.gray(stdout));
                        callback(error);
                    }
                );
            },
            // Commit the changes...
            function(callback){
                exec(
                    sprintf('git commit -m "automatic nog commit on gh-pages %s"', moment().toISOString()),
                    function (error, stdout) {
                        console.log(colors.gray(stdout));
                        callback(error);
                    }
                );
            },
            // Push the changes...
            function(callback){
                exec(
                    'git push origin gh-pages',
                    function (error, stdout) {
                        console.log(colors.gray(stdout));
                        callback(error);
                    }
                );
            },
            // Make sure we're back on the master branch...
            function(callback){
                exec(
                    'git checkout master',
                    function (error, stdout) {
                        console.log(colors.gray(stdout));
                        callback(error);
                    }
                );
            }
        ],
        function(err){
            if (err){
                grunt.log.error(err);
            } else {
                grunt.log.oklns('Sit pushed!');
            }
            done();
        }
    );
};



