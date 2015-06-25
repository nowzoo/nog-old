module.exports = function(grunt, done){
    var async = require('async');
    var fs =  require('fs');
    var ncp =  require('ncp').ncp;
    var path =  require('path');
    var sprintf = require('sprintf-js').sprintf;
    var exec = require('child_process').exec;


    var lib_path = path.dirname(__dirname);


    async.series(
        [

            // Make sure we're on master
            function(callback){
                var cmd = 'git checkout master';
                grunt.verbose.writeln('Checking out master: %s', cmd);
                exec(cmd, callback);
            },


            // Create gh-pages branch
            function(callback){
                var cmd = 'git status --porcelain';
                grunt.verbose.writeln('Checking git status: %s', cmd);
                exec(cmd, function(err, stdout, stderr){
                    if (err) return callback(err);
                    if (stdout.length > 0) err = new Error('You have uncommitted changes on the master branch. Commit these changes first.');
                    callback(err);
                });
            },


            // Create gh-pages branch
            function(callback){
                var cmd = 'git checkout --orphan gh-pages';
                grunt.verbose.writeln('Creating gh-pages branch: %s', cmd);
                exec(cmd, callback);
            },

            // Empty gh-pages branch...
            function(callback){
                var cmd = 'git rm -rf .';
                grunt.verbose.writeln('Emptying gh-pages branch: %s', cmd);
                exec(cmd, callback);
            },

            // Add the initial files that go in the gh-pages branch...
            // - .gitignore created from scratch


            // create .gitignore ...
            function(callback){
                var dst = path.join(process.cwd(), '.gitignore');
                var ignore = ['node_modules', '_site'];
                grunt.verbose.writeln('Creating .gitignore');
                fs.writeFile(dst, ignore.join('\n'), callback);
            },

            // Add the files to git on gh-pages...
            function(callback){
                var cmd = 'git add -A';
                grunt.verbose.writeln('Add: %s', cmd);
                exec(cmd, callback);
            },

            // Commit on gh-pages...
            function(callback){
                var cmd = 'git commit -m "Initial nog commit on gh-pages"';
                grunt.verbose.writeln('Commit: %s', cmd);
                exec(cmd, callback);
            },

            // Checkout master
            function(callback){
                var cmd = 'git checkout master';
                grunt.verbose.writeln('Checking out master: %s', cmd);
                exec(cmd, callback);
            }



        ],
        function(err){
            done(err);
        }
    )
}
