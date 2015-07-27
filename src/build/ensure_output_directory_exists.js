'use strict';
var moment = require('moment');
var fs = require('fs-extra');
var sprintf = require('sprintf-js').sprintf;
var colors = require('colors/safe');



var log = require('../utils/log');


module.exports = function(build, callback){
    var start = moment();
    log.verbose(colors.gray.bold('\nEnsuring the output directory exists... \n'));
    fs.stat(build.output_directory, function (err, stat) {
        if (! err) {
            if (! stat.isDirectory()){
                err = new Error(sprintf('Not a directory: %s', output_directory));
            }
        }
        if (! err){
            log.verbose('\t', colors.gray(sprintf('Done in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
        }
        callback(err);
    });
}
