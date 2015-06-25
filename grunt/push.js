module.exports = function(grunt, callback){
    var async = require('async');
    var _ =  require('lodash');
    var fs =  require('fs');
    var moment =  require('moment');
    var ncp =  require('ncp').ncp;
    var rimraf =  require('rimraf');
    var path =  require('path');
    var colors = require('colors/safe');
    var sprintf = require('sprintf-js').sprintf;
    var exec = require('child_process').exec;

    var file_list;



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
            // Create gh-pages branch
            function(callback){
                var cmd = 'git checkout gh-pages';
                grunt.verbose.writeln('Checkout gh-pages branch: %s', cmd);
                exec(cmd, callback);
            },

            function(callback){
                grunt.verbose.writeln('Reading old files...');
                fs.readdir(process.cwd(), function(err, result){
                    file_list = result;
                    callback(err);
                })
            },

            function(callback){
                var keep = ['README.md', 'node_modules', '.gitignore', '_site'];
                grunt.verbose.writeln('Deleting old files...');
                async.each(file_list, function(name, callback){
                    if (_.indexOf(keep, name) !== -1) return callback();
                    if (name.indexOf('.') === 0) return callback();
                    grunt.verbose.writeln('Deleting %s.', name);
                    rimraf(name, callback);
                }, callback)
            },

            function(callback){
                var src = path.join(process.cwd(), '_site');
                var dst = process.cwd();
                grunt.verbose.writeln('Copying _site to root directory...');
                ncp(src, dst, callback);
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
            },
            // Make sure we're on master
            function(callback){
                var cmd = 'git checkout master';
                grunt.verbose.writeln('Checking out master: %s', cmd);
                exec(cmd, callback);
            }


        ],
        function(err){
            var cmd = 'git checkout master';
            grunt.verbose.writeln('Checking out master: %s', cmd);
            exec(cmd, function(){
                callback(err);
            });
        }
    )
}
