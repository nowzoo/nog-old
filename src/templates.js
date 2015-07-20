'use strict';
var async = require('async');
var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var glob = require('glob');
var fs = require('fs');
var colors = require('colors/safe');
var S = require('string');
var marked = require('marked');
var yamlFront = require('yaml-front-matter');
var sprintf = require('sprintf-js').sprintf;

var log = require('./log');

var read = module.exports.read = function(input_directory, callback){
    var data = {};
    var start = moment();
    log.verbose(colors.gray.bold('\nReading templates...\n'));
    async.series(
        [
            function(callback){
                var template_directory = path.join(input_directory, '_templates');
                log.verbose(colors.gray('\tYour templates...\n'));
                read_template_directory(template_directory, function(err, result){
                    data.user = result;
                    if (! err) {
                        _.each(result, function(val, key){
                            log.verbose('\t\t', colors.gray(key), '\n');
                        });
                    }
                    callback(err);
                });
            },
            function(callback){
                var template_directory = path.join(path.dirname(__dirname), 'defaults', '_templates');
                log.verbose(colors.gray('\tDefault templates...\n'));
                read_template_directory(template_directory, function(err, result){
                    data.defaults = result;
                    if (! err) {
                        _.each(result, function(val, key){
                            log.verbose('\t\t', colors.gray(key), '\n');
                        });
                    }
                    callback(err);
                });
            }
        ],
        function (err) {
            if (! err){
                log.verbose(colors.gray('\tDone reading templates ('));
                log.verbose(colors.gray((moment().valueOf() - start.valueOf())/1000 + 's)\n'));
            }
            callback(err, data);
        }
    );
};

var read_template_directory = module.exports.read_template_directory = function(template_directory, callback){
    var p = path.join(template_directory, '**', '*.*');
    glob(p, function(err, result){
        var o = {};
        _.each(result, function(absolute_path){
            var rel = path.relative(template_directory, absolute_path);
            o[rel] = absolute_path;
        });
        callback(err, o);
    });
};

