var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var moment =  require('moment');
var path =  require('path');
var sprintf = require('sprintf-js').sprintf;
var colors = require('colors/safe');

var exec = require('child_process').exec;
var temp = require('temp');
var build = require('./build/build');
var log = require('../utils/log');

module.exports = function(){

    var git_get_origin = require('./git_get_origin');
    var origin;
    var output_directory;
    var start = moment();


    log(colors.blue.bold('\nPushing...\n'));


    temp.track();


    async.series(
        [

            //get the origin...
            function(callback){
                var start = moment();
                log(colors.gray.bold('\nGetting origin...\n'));
                git_get_origin(function(err, result){
                    origin = result;
                    if (! err){
                        log(colors.green('\tOK: '), colors.gray(origin), '\n');
                        log('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    }
                    callback(err)
                });
            },

            function (callback) {
                var start = moment();
                log(colors.gray.bold('\nCreating a temporary directory...\n'));
                temp.mkdir('nog-', function(err, result){
                    output_directory = result.toString();
                    log('\t', colors.gray(output_directory), '\n');
                    log('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    callback(err)
                });
            },

            //git init
            function(callback){
                var cmd = 'git init';
                var start = moment();
                log(colors.gray.bold('\nInitializing git...\n'));
                log(colors.gray('\t' + cmd + '\n'));
                exec(cmd, {cwd: output_directory}, function(err){
                    log('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    callback(err);
                });
            },

            //git add origin
            function(callback){

                var start = moment();
                var cmd = sprintf('git remote add origin %s', origin);
                log(colors.gray.bold('\nAdding the origin...\n'));
                log(colors.gray('\t' + cmd + '\n'));
                exec(cmd, {cwd: output_directory}, function(err){
                    log('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    callback(err);
                });
            },

            //Create gh-pages branch
            function(callback){
                var start = moment();
                var cmd = 'git checkout --orphan gh-pages';
                log(colors.gray.bold('\nCreating gh-pages branch...\n'));
                log(colors.gray('\t' + cmd + '\n'));
                exec(cmd, {cwd: output_directory}, function(err){
                    log('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    callback(err);
                });
            },

            //Pull origin gh-pages branch
            function(callback){
                var start = moment();
                var cmd = 'git pull origin gh-pages';
                log(colors.gray.bold('\nPulling the gh-pages branch...\n'));
                log(colors.gray('\t' + cmd + '\n'));
                exec(cmd, {cwd: output_directory}, function(err){
                    log('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    callback(err);
                });
            },
            //build the site...
            function (callback) {
                build.build(true, process.cwd(), output_directory, callback);
            },

            //Add all the changes to git...
            function(callback){
                var start = moment();
                var cmd = 'git add -A';
                log(colors.gray.bold('\nAdding changes to git...\n'));
                log(colors.gray('\t' + cmd + '\n'));
                exec(cmd, {cwd: output_directory}, function(err){
                    log('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    callback(err);
                });
            },

            //Commit all the changes...
            function(callback){
                var start = moment();
                var cmd = sprintf('git commit -m \'Automated nog commit to gh-pages on %s\'', moment().toISOString());
                log(colors.gray.bold('\nCommitting changes to git...\n'));
                log(colors.gray('\t' + cmd + '\n'));
                exec(cmd, {cwd: output_directory}, function(err){
                    log('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    callback(err);
                });
            },

            //Push the changes...
            function(callback){
                var start = moment();
                var cmd = 'git push origin gh-pages';
                log(colors.gray.bold('\nPushing changes to GitHub...\n'));
                log(colors.gray('\t' + cmd + '\n'));
                exec(cmd, {cwd: output_directory}, function(err){
                    log('\t', colors.gray(sprintf('Done in %ss',(moment().valueOf() - start.valueOf())/1000)), '\n');
                    callback(err);
                });
            }


        ],
        function(err){
            if (! err){
                log(colors.bold.green(sprintf('\nPushed changes in %ss.\n\n', (moment().valueOf() - start.valueOf())/1000)));

            } else {
                temp.cleanupSync();
                log('\n', colors.red.bold(err), '\n');
                process.exit(1);
            }
        }
    )
};

