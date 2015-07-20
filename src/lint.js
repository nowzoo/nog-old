/* jshint node: true */
var moment = require('moment');
var path = require('path');
var async = require('async');
var colors = require('colors/safe');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var log = require('./log');
var data = require('./data');
var build = require('./build');
var config = require('./config');

module.exports = function () {
    'use strict';


    var build_data;
    
    var start = moment();
    log(colors.blue.bold('\nLinting Nog...\n'));



    async.series(
        [
            //get the data...
            function(callback){
                data.read(process.cwd(), true, function(err, result){
                    build_data = result;
                    callback(err);
                });
            }

        ],

        function(err){
            if (! err){
                lint_config(build_data);
                lint_atomic(build_data);
                log('\n', '\n');

            } else {
                log('\n', colors.red.bold(err), '\n');
                process.exit(1);
            }
            

        }
    )
};

var lint_config = function(build_data){
    log('\n', colors.gray.bold('Site Config'), '\n');
    if (0 === _.size(build_data.config.__lint)){
        log('\t', colors.green('Everything ok.'), '\n');
    } else {
        _.each(build_data.config.__lint, function(err){
            log('\t', colors.red(err), '\n');
        });
    }
};

var lint_atomic = function(build_data){


    var lint = {};
    var index;
    log('\n', colors.gray.bold('Atomic Content'), '\n');
    if (0 === _.size(build_data.contents)){
        log('\t', colors.red('No content found!'), '\n');
    } else {
        index = _.findWhere(build_data.contents, {uri: ''});
        if (! index){
            log('\t', colors.red('No home page found!'), '\n');
        }
    }

    _.each(build_data.contents, function(content){
        log('\t', colors.gray.bold(content.relative_path), '\n');
        if (0 !== _.size(content.lint)){
            _.each(content.lint, function(err){
                log('\t\t', colors.red(err), '\n');
            });
        } else {
            log('\t\t', colors.green('Everything ok.'), '\n');
        }
    });

};

