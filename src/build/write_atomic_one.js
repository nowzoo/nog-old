"use strict";
var path = require('path');
var async = require('async');
var fs = require('fs-extra');
var moment = require('moment');
var _ = require('lodash');
var colors = require('colors/safe');
var sprintf = require('sprintf-js').sprintf;

var get_base_template_data = require('./get_base_template_data');
var get_output_path = require('../content/get_output_path');
var log = require('../utils/log');
module.exports = function(build, site, content, changed_uris, callback){
    var passed;
    var rendered;
    var start = moment();
    changed_uris.push(content.uri);
    log.verbose(colors.gray(sprintf('\tProcessing %s... \n', content.relative_path)));

    if (content.ignored){
        log.verbose(colors.gray(sprintf('\t\tIgnoring %s.\n', content.relative_path)));
        return callback(null);
    }
    if (! content.published){
        log.verbose(colors.gray(sprintf('\t\tIgnoring %s because it is not published.\n', content.relative_path)));
        return callback(null);
    }


    passed = _.extend(get_base_template_data(build, site), {
        post: content
    });

    async.series(
        [
            function(callback){
                var templates_path = path.join(build.input_directory, '_templates');
                var abs = path.join(templates_path, content.template);
                console.log(content.template);
                log.verbose(colors.gray(sprintf('\t\tRendering file %s with template %s...\n', content.relative_path, content.template)));
                build.render_template(abs, passed, function(err, result){
                    rendered = result || '';
                    if (err){
                        log(colors.yellow(sprintf('\t\tError rendering %s: %s\n', content.relative_path, err.message)));
                    }
                    callback(null);
                });
            },
            function(callback){
                var output_path = path.join(build.output_directory, get_output_path(site, build, content.uri));
                console.log(output_path);
                var relative_output_path = path.relative(build.output_directory, output_path);
                log.verbose(colors.gray(sprintf('\t\tWriting file %s\n', relative_output_path)));
                fs.outputFile(output_path, rendered, function(err){
                    if (err){
                        log(colors.yellow(sprintf('\t\tError writing %s: %s\n', relative_output_path, err.message)));
                    }
                    callback(null);
                });
            }
        ],
        function(err){
            if (! err){
                log.verbose('\t\t', colors.gray(sprintf('Done in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
            }
            callback(err);
        }
    )



};
