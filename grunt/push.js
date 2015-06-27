module.exports = function(grunt, callback){
    var async = require('async');
    var moment =  require('moment');
    var path =  require('path');
    var sprintf = require('sprintf-js').sprintf;
    var exec = require('child_process').exec;


    var git_get_status = require('git-get-status');



    var orig_dir = process.cwd();
    var _site_dir = path.join(orig_dir, '_site');
    var status = false;

    async.series(
        [
            // switch to _site directory...
            function(callback){
                process.chdir(_site_dir);
                grunt.verbose.writeln('Changed working directory to %s', _site_dir);
                callback();
            },

            // checkout gh-pages
            function(callback){
                var cmd = 'git checkout gh-pages';
                grunt.verbose.writeln('Checking out gh-pages: %s', cmd);
                exec(cmd, callback);
            },

            // get the status...
            function(callback){
                grunt.verbose.writeln('Determining the status of the gh-pages branch...');
                git_get_status(function(err, result){
                    status = result;
                    grunt.verbose.writeln('gh-pages clean: %s', status.clean ? 'Yes' : 'No');
                    callback(err);
                });
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
};
