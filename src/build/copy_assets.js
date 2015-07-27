"use strict";
var path = require('path');
var moment = require('moment');
var async = require('async');
var fs = require('fs-extra');
var colors = require('colors/safe');
var sprintf = require('sprintf-js').sprintf;
var glob = require('glob');


var log = require('../utils/log');
var get_asset_uri = require('../path/get_asset_uri');
var get_relative_url = require('../content/get_relative_url');

module.exports = function(build, site, changed_uris, callback){
    var start = moment();
    var files;
    var src_assets_path = path.join(build.input_directory, '_assets');
    log.verbose(colors.gray.bold('\nCopying _assets... \n'));
    async.series(
        [
            function(callback){
                var p = path.join(src_assets_path, '**', '*.*');
                log.verbose('\t', colors.gray(sprintf('Reading files....')), '\n');
                glob(p, function (err, result) {
                    files = result;
                    callback(err);
                });
            },
            function(callback){

                async.eachSeries(
                    files,
                    function(file, callback){
                        var uri = get_asset_uri(build, site, file);
                        var src = path.join(src_assets_path, uri.split('/').join(path.sep));
                        var dst = path.join(build.output_directory, uri.split('/').join(path.sep));
                        changed_uris.push(get_relative_url(uri));
                        log.verbose('\t\t', colors.gray(sprintf('Copying %s', uri)), '\n');
                        fs.copy(src, dst, callback);
                    },
                    callback);
            }
        ],
        function(err){
            if (! err){
                log.verbose('\t', colors.gray(sprintf('Done copying _assets in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');

            }
            callback(err);
        }
    );
};
