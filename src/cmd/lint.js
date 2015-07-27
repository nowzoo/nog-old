/* jshint node: true */
var moment = require('moment');
var path = require('path');
var async = require('async');
var colors = require('colors/safe');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var log = require('../utils/log');


module.exports = function (what) {
    'use strict';


    var build_data;
    
    var start = moment();
    log(colors.blue.bold(sprintf('\nLinting %s...\n', what.join(', '))));



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

                lint(build_data, what);
                log('\n', '\n');

            } else {
                log('\n', colors.red.bold(err), '\n');
                process.exit(1);
            }
            

        }
    )
};

var lint = function(build_data, whats){
    if (_.isArray(whats) && 0 < whats.length){
        _.each(whats, function(str){
            if ('config' === str || '_cfg/' === str || '_cfg/site.json' === str){
                lint_config(build_data);
                return;
            }
            if ('_content' === str || 'content' === str || '_content/' === str){
                lint_atomic(build_data);
                return;
            }
            if (str.indexOf('_content/') === 0){
                var relative_path = str.replace(/^_content\//, '');
                if (_.has(build_data.contents, relative_path)){
                    lint_content_one(build_data.contents[relative_path]);
                    return;
                }
            }
            log(colors.red(sprintf('Cannot understand what you mean by "%s".\n', str)));
        });
    } else {
        lint_config(build_data);
        lint_atomic(build_data);
    }
};

var lint_config = function(build_data){
    log('\n\t', colors.gray.bold('Site Config'), '\n');
    if (0 === _.size(build_data.config.__lint)){
        log('\t\t', colors.green('Everything ok.'), '\n');
    } else {
        _.each(build_data.config.__lint, function(err){
            log('\t\t', colors.yellow(err), '\n');
        });
    }
};

var lint_atomic = function(build_data){


    var lint = {};
    var index;
    log('\n', colors.gray.bold('Atomic Content'), '\n');
    if (0 === _.size(build_data.contents)){
        log('\t', colors.yellow('No content found!'), '\n');
    } else {
        index = _.findWhere(build_data.contents, {uri: ''});
        if (! index){
            log('\t', colors.yellow('No home page found!'), '\n');
        }
    }

    _.each(build_data.contents, function(content){
        lint_content_one(content);
    });

};

var lint_content_one = function(content){
    log('\t', colors.gray.bold(content.relative_path), '\n');
    if (0 !== _.size(content.lint)){
        _.each(content.lint, function(err){
            log('\t\t', colors.yellow(err), '\n');
        });
    } else {
        log('\t\t', colors.green('Everything ok.'), '\n');
    }
}

