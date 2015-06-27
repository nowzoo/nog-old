module.exports = function(grunt, callback){
    var fs = require('fs');
    var async = require('async');
    var _ = require('lodash');
    var moment =  require('moment');
    var path =  require('path');
    var sprintf = require('sprintf-js').sprintf;
    var rimraf = require('rimraf');
    var ncp = require('ncp').ncp;

    var exec = require('child_process').exec;
    var temp = require('temp');
    var build = require('./build');


    var git_get_status = require('git-get-status');



    var orig_dir = process.cwd();
    var _site_dir = path.join(orig_dir, '_site');
    var temp_dir;
    var status = false;
    var git_get_origin = require('./git_get_origin');
    var origin;
    var file_list;

    temp.track();


    async.series(
        [

            //get the origin...
            function(callback){
                grunt.verbose.write('Getting origin...');
                git_get_origin(grunt, function(err, result){
                    origin = result;
                    grunt.log.writeln(origin);
                    callback(err)
                });
            },

            // get a temp directory...
            function(callback){
                grunt.verbose.write('Creating temporary directory...');
                temp.mkdir('nog-push', function(err, result){
                    temp_dir = result;
                    grunt.log.writeln(temp_dir);
                    callback(err)
                });
            },

            // switch to temp directory...
            function(callback){
                process.chdir(temp_dir);
                grunt.verbose.writeln('Changed working directory to %s', orig_dir);
                callback();
            },

            //git init
            function(callback){
                var cmd = 'git init';
                grunt.log.writeln('Initializing git: %s', cmd);
                exec(cmd, callback);
            },

            //add origin
            function(callback){
                var cmd = sprintf('git remote add origin %s', origin);
                grunt.log.writeln('Adding remote: %s', cmd);
                exec(cmd, callback);
            },

            // Create gh-pages branch
            function(callback){
                var cmd = 'git checkout --orphan gh-pages';
                grunt.log.writeln('Creating fresh gh-pages branch: %s', cmd);
                exec(cmd, callback);
            },

            // Pull origin gh-pages...
            function(callback){
                var cmd = 'git pull origin gh-pages';
                grunt.log.writeln('Pulling: %s', cmd);
                exec(cmd, callback);
            },

            //get the old files...
            function(callback){
                grunt.verbose.writeln('Reading old files...');
                fs.readdir(temp_dir, function(err, result){
                    file_list = result;

                    callback(null);
                });
            },


            //remove the old files...
            function(callback){
                var keep = ['.gitignore', '.git'];
                grunt.verbose.writeln('Deleting old files...');
                async.each(file_list, function(name, callback){
                    var p = path.join(temp_dir, name);
                    if (_.indexOf(keep, name) !== -1) return callback();
                    if (name.indexOf('.') === 0) return callback();
                    grunt.verbose.writeln('Deleting: %s', name);
                    rimraf(p, callback);
                }, callback);
            },

            //read the new files...
            function(callback){
                grunt.verbose.writeln('Reading new files...');
                fs.readdir(_site_dir, function(err, result){
                    file_list = result;

                    callback(null);
                });
            },

            //copy the new files...
            function(callback){
                var keep = ['.gitignore', '.git'];
                grunt.verbose.writeln('Copying new files...');
                async.each(file_list, function(name, callback){
                    var src = path.join(_site_dir, name);
                    var dst = path.join(temp_dir, name);
                    if (_.indexOf(keep, name) !== -1) return callback();
                    if (name.indexOf('.') === 0) return callback();
                    grunt.verbose.writeln('Copying: %s', name);
                    ncp(src, dst, callback);
                }, callback);
            },

            // Add all the changes...
            function(callback){
                var cmd = 'git add -A';
                grunt.verbose.writeln('Adding changes: %s', cmd);
                exec(cmd, callback);
            },


            // Commit the changes...
            function(callback){
                var cmd = sprintf('git commit -m \'Automated nog commit to gh-pages on %s\'', moment().toISOString());
                grunt.verbose.writeln('Commit changes: %s', cmd);
                exec(cmd, callback);
            },

            // Push the changes...
            function(callback){
                var cmd = 'git push origin gh-pages';
                grunt.verbose.writeln('Push changes: %s', cmd);
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
