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

module.exports = function(build, site, archive, written_files, callback){

    var passed;
    var start = moment();
    var rendered;


    log.verbose(colors.gray(sprintf('\tProcessing the %s archive "%s"... \n', archive.type, archive.title)));

    async.eachSeries(archive.pages, function(page, callback){
        log.verbose(colors.gray(sprintf('\t\tProcessing page %s of %s... \n', page.page + 1, archive.page_count)));

        passed = _.extend(get_base_template_data(build, site), {
            archive: archive,
            page: page
        });
        async.series(
            [
                function (callback) {
                    var templates_path = path.join(build.input_directory, '_templates');
                    var abs = path.join(templates_path, 'archive' + site.default_template_extension);
                    log.verbose(colors.gray(sprintf('\t\tRendering %s...\n', page.uri)));
                    build.render_template(abs, passed, function(err, result){
                        rendered = result || '';
                        if (err){
                            log(colors.yellow(sprintf('\t\tError rendering %s: %s\n', page.uri , err.message)));
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    var output_path = get_output_path(site, build, page.uri);
                    var relative_output_path = path.relative(build.output_directory, output_path);
                    log.verbose(colors.gray(sprintf('\t\tWriting file %s\n', relative_output_path)));
                    written_files.push(output_path);
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

    }, callback);
};
