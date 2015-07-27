'use strict';
var _ = require('lodash');
var path = require('path');
var async = require('async');
var moment = require('moment');
var fs = require('fs-extra');
var glob = require('glob');
var sprintf = require('sprintf-js').sprintf;
var colors = require('colors/safe');

var log = require('../utils/log');


module.exports = function(build, changed_uris, callback){
    var start = moment();
    var files;
    log.verbose(colors.gray.bold('\nRemoving old files... \n'));
    async.series(
        [

            function(callback){
                log.verbose('\t', colors.gray(sprintf('Reading files....')), '\n');
                var p = path.join(build.output_directory, '**', '*.*');
                glob(p, function (err, result) {
                    files = result;
                    _.each(files, function(file){
                        var rel = path.relative(build.output_directory, file);
                        var slugs = rel.split(path.sep);
                        changed_uris.push('/' + slugs.join('/'));
                    });
                    callback(err);
                });
            },
            function(callback){
                async.each(files, function(file, callback){
                    var abs = path.resolve(build.output_directory, file);
                    if ('.git' === file || '.built.json' === file) {
                        callback(null);
                    } else {
                        log.verbose('\t\t', colors.gray(sprintf('Removing %s',file)), '\n');
                        fs.remove(abs, callback);
                    }

                }, callback);
            }
        ],
        function(err){
            if (! err){
                log.verbose('\t', colors.gray(sprintf('Done removing old files in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
            }
            callback(err);
        }
    );
};

