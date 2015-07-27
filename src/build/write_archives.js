"use strict";
var path = require('path');
var async = require('async');
var fs = require('fs-extra');
var moment = require('moment');
var _ = require('lodash');
var colors = require('colors/safe');
var sprintf = require('sprintf-js').sprintf;


var write_archive_one = require('./write_archive_one');
module.exports = function(build, site, archives, changed_uris, callback){
    var start = moment();
    var logs = [];
    var archives_to_build = [];
    log.verbose(colors.gray.bold('\nWriting archives content... \n'));
    if ('' !== site.archives_directory){
        archives_to_build.push(archives.main);
        if (! build_data.config.archives_generate_tags){
            logs.push('Tag archives are disabled.')
        } else {
            archives_to_build = archives_to_build.concat(_.values(archives.tags));
        }
        if (! build_data.config.archives_generate_dates){
            logs.push('Date archives are disabled.')
        } else {
            archives_to_build = archives_to_build.concat(_.values(archives.dates));
        }
    } else {
        logs.push('Post archives are disabled.');
    }
    async.eachSeries(archives_to_build, function(archive, callback){
        write_archive_one(build, site, archive, changed_uris, callback);
    }, function(err){
        if (! err){
            _.each(logs, function(log){
                log.verbose('\t', colors.gray(log), '\n');
            });
            log.verbose('\t', colors.gray(sprintf('Done writing archives in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
        }
        callback(err);
    });
};
