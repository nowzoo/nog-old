"use strict";
var async = require('async');
var moment = require('moment');
var colors = require('colors/safe');
var sprintf = require('sprintf-js').sprintf;

var write_atomic_one = require('./write_atomic_one');
var log = require('../utils/log');

module.exports = function(build, site, contents, written_files, callback){
    var start = moment();
    log.verbose(colors.gray.bold('\nWriting atomic content... \n'));
    async.eachSeries(contents, function(content, callback){
        write_atomic_one(build, site, content, written_files, callback);
    }, function(err){
        if (! err){
            log.verbose('\t', colors.gray(sprintf('Done writing atomic content in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
        }
        callback(err);
    });
};
