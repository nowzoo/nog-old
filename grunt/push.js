module.exports = function(grunt, callback){
    var async = require('async');
    var _ =  require('lodash');
    var fs =  require('fs');
    var moment =  require('moment');
    var ncp =  require('ncp').ncp;
    var rimraf =  require('rimraf');
    var path =  require('path');
    var sprintf = require('sprintf-js').sprintf;
    var exec = require('child_process').exec;


    var git_get_origin = require('./git_get_origin');


    var orig_dir = process.cwd();
    var _site_dir = path.join(orig_dir, '_site');
    var master_needs_update = false;
    var gh_pages_needs_update = false;

    async.series(
        [


            // Make sure we're on master
            function(callback){
                var cmd = 'git checkout master';
                grunt.verbose.writeln('Checking out master: %s', cmd);
                exec(cmd, callback);
            },
            // Add all the changes...
            function(callback){
                var cmd = 'git add -A';
                grunt.verbose.writeln('Adding changes in master: %s', cmd);
                exec(cmd, callback);
            },
            // Commit the changes...
            function(callback){
                var cmd = sprintf('git commit -m \'Automated nog commit on %s\'', moment().toISOString());
                grunt.verbose.writeln('Commit changes in master: %s', cmd);
                exec(cmd, callback);
            },

            // Push the changes...
            function(callback){
                var cmd = 'git push origin master';
                grunt.verbose.writeln('Push changes in master: %s', cmd);
                exec(cmd, callback);
            },


            // switch to _site directory...
            function(callback){
                process.chdir(_site_dir);
                grunt.verbose.writeln('Changed working directory to %s', _site_dir);
                callback();
            },




            // Add all the changes...
            function(callback){
                var cmd = 'git add -A';
                grunt.verbose.writeln('Adding changes in gh-pages: %s', cmd);
                exec(cmd, callback);
            },
            // Commit the changes...
            function(callback){
                var cmd = sprintf('git commit -m \'Automated nog commit to gh-pages on %s\'', moment().toISOString());
                grunt.verbose.writeln('Commit changes in gh-pages: %s', cmd);
                exec(cmd, callback);
            },

            // Push the changes...
            function(callback){
                var cmd = 'git push origin gh-pages';
                grunt.verbose.writeln('Push changes to gh-pages: %s', cmd);
                exec(cmd, callback);
            }


        ],
        function(err){
            process.chdir(orig_dir);
            grunt.verbose.writeln('Changed working directory to %s', orig_dir);
            callback(err);
        }
    )
}
