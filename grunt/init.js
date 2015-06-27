module.exports = function(grunt, done){
    var async = require('async');
    var fs =  require('fs');
    var path =  require('path');
    var rimraf =  require('rimraf');
    var sprintf = require('sprintf-js').sprintf;
    var exec = require('child_process').exec;


    var git_get_origin = require('./git_get_origin');
    var origin;
    var orig_dir = process.cwd();
    var _site_dir = path.join(orig_dir, '_site');


    async.series(
        [
            //get the origin...
            function(callback){
                grunt.log.write('Getting origin...');
                git_get_origin(grunt, function(err, result){
                    origin = result;
                    grunt.log.writeln(origin);
                    callback(err)
                });
            },

            function(callback){
                grunt.log.writeln('Deleting _site directory...');
                rimraf(_site_dir, callback);
            },

            function(callback){
                grunt.log.writeln('Making fresh _site directory...');
                fs.mkdir(_site_dir, callback);
            },

            //git init
            function(callback){
                var cmd = 'git init';
                process.chdir(_site_dir);
                grunt.log.writeln('Initializing git in _site: %s', cmd);
                exec(cmd, callback);
            },

            //git init
            function(callback){
                var cmd = sprintf('git remote add origin %s', origin);
                grunt.log.writeln('Adding remote for _site: %s', cmd);
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
            }



        ],
        function(err){
            process.chdir(orig_dir);
            done(err);
        }
    )
};
