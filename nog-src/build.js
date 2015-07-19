'use strict';
var async = require('async');
var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var glob = require('glob');
var fs = require('fs-extra');
var S = require('string');
var marked = require('marked');
var yamlFront = require('yaml-front-matter');
var sprintf = require('sprintf-js').sprintf;
var swig = require('swig');
var colors = require('colors/safe');
var ncp = require('ncp').ncp;



var utils = require('./utils');
var data = require('./data');
var atomic = require('./atomic');
var log = require('./log');


var build = module.exports.build = function(is_build_public, input_directory, output_directory, callback){
    var files;
    var build_data;
    var start = moment();

    log.verbose(colors.gray.bold(sprintf('\nBuilding the site...\n')));
    log.verbose(colors.gray(sprintf('\tPublic build: %s\n', is_build_public)));
    log.verbose(colors.gray(sprintf('\tInput directory: %s\n', input_directory)));
    log.verbose(colors.gray(sprintf('\tOutput directory: %s\n', output_directory)));
    async.series(
        [
            //make sure the directory exists and is a directory...
            function(callback){
                var start = moment();
                log.verbose(colors.gray.bold('\nEnsuring the output directory exists... \n'));
                fs.stat(output_directory, function (err, stat) {
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
            },

            //delete the existing files...
            function(callback){
                remove_old_files(output_directory, callback);
            },

            //get the data...
            function(callback){
                data.read(input_directory, is_build_public, function(err, result){
                    build_data = result;
                    callback(err);
                });
            },
            //write the atomic contents...
            function(callback){
                write_contents(build_data, output_directory, callback);
            },
            //write the archives...
            function(callback){

                write_archives(build_data, output_directory, callback);
            },

            //copy _assets...
            function(callback){
                copy_assets(build_data, input_directory, output_directory, callback);
            },

            //write search index...
            function(callback){
                write_search_index(build_data, output_directory, callback);
            }
        ],
        function (err) {
            if (! err){
                log.verbose(colors.gray.bold(sprintf('\nSite built in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
            }
            callback(err);
        }
    );
};

var write_contents = module.exports.write_contents = function(build_data, output_directory, callback){
    var start = moment();
    log.verbose(colors.gray.bold('\nWriting atomic content... \n'));
    async.eachSeries(build_data.contents, function(content, callback){
        write_content(build_data, content, output_directory, callback);
    }, function(err){
        if (! err){
            log.verbose('\t', colors.gray(sprintf('Done writing atomic content in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
        }
        callback(err);
    });
};

var write_content = module.exports.write_content = function(build_data, content, output_directory, callback){
    var rel_p;
    var p;
    var uri;
    var template;
    var rel_template;
    var passed;
    var ignored;
    var rendered;
    var start = moment();
    log.verbose(colors.gray(sprintf('\tProcessing %s... \n', content.relative_path)));
    ignored = content_is_ignored(build_data, content);
    if (ignored){
        log.verbose(colors.gray(sprintf('\t\tIgnoring %s: %s\n', content.relative_path, ignored)));
        callback(null);
    } else {
        template = atomic.get_template(build_data, content);
        rel_template = path.relative(build_data.input_directory, template);
        uri = atomic.get_uri(build_data, content);
        p = path.join(output_directory, uri.split('/').join(path.sep), 'index.html');
        rel_p = path.relative(output_directory, p);
        passed = {
            post: content,
            site: build_data
        };
        async.series(
            [
                function(callback){
                    log.verbose(colors.gray(sprintf('\t\tRendering %s with template %s...\n', content.relative_path, rel_template)));
                    swig.renderFile(template, passed, function(err, result){
                        rendered = result;
                        callback(err);
                    });
                },
                function(callback){
                    log.verbose(colors.gray(sprintf('\t\tWriting file %s...\n', rel_p, template)));
                    fs.outputFile(p, rendered, callback);
                }
            ],
            function(err){
                if (! err){
                    log.verbose('\t\t', colors.gray(sprintf('Done in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
                }
                callback(err);
            }
        )
    }



};

var write_archives = module.exports.write_archives = function(build_data, output_directory, callback){
    var archives = [];
    var start = moment();
    var logs = [];
    log.verbose(colors.gray.bold('\nWriting archives content... \n'));
    if ('' !== build_data.config.archives_directory){
        archives.push(build_data.archives.main);
        if (! build_data.config.archives_generate_tags){
            logs.push('Tag archives are disabled.')
        } else {
            archives = archives.concat(_.values(build_data.archives.tags));
        }
        if (! build_data.config.archives_generate_dates){
            logs.push('Date archives are disabled.')
        } else {
            archives = archives.concat(_.values(build_data.archives.dates));
        }
    } else {
        logs.push('Post archives are disabled.');
    }
    async.each(archives, function(archive, callback){
        write_archive(build_data, archive, output_directory, callback);
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

var write_archive = module.exports.write_archive = function(build_data, archive, output_directory, callback){
    var p;
    var uri;
    var template;
    var passed;
    var start = moment();

    template = path.join(process.cwd(), '_templates', 'archive.twig');

    log.verbose(colors.gray(sprintf('\tProcessing the %s archive "%s"... \n', archive.type, archive.title)));

    async.eachSeries(archive.pages, function(page, callback){
        log.verbose(colors.gray(sprintf('\t\tProcessing page %s of %s... \n', page.page + 1, archive.page_count)));

        passed = {
            archive: archive,
            page: page,
            site: build_data
        };
        p = path.join(output_directory, page.slugs.join(path.sep), 'index.html');
        swig.renderFile(template, passed, function(err, result){
            fs.outputFile(p, result, callback);
        });
    }, callback);
};

var content_is_ignored = function(build_data, content){
    if (atomic.get_is_ignored_bad_uri(build_data, content)) return content.lint.is_ignored_bad_uri;
    if (atomic.get_is_ignored_extension(build_data, content)) return content.lint.is_ignored_extension;
    if (atomic.get_is_ignored_conflicts_with_archive(build_data, content)) return content.lint.is_ignored_conflicts_with_archive;
    if (atomic.get_is_ignored_overridden_by_sibling(build_data, content)) return content.lint.is_ignored_overridden_by_sibling;
    if (atomic.get_is_ignored_overridden_by_index(build_data, content)) return content.lint.is_ignored_overridden_by_index;
    if (! atomic.get_published(build_data, content)) return content.lint.published;
    return false;
};

var copy_assets = function(build_data, input_directory, output_directory, callback){
    var start = moment();
    var files;
    log.verbose(colors.gray.bold('\nCopying _assets... \n'));
    async.series(
        [
            function(callback){
                var p = path.join(build_data.input_directory, '_assets');
                log.verbose('\t', colors.gray(sprintf('Reading files....')), '\n');
                fs.readdir(p, function (err, result) {
                    files = result;
                    callback(err);
                });
            },
            function(callback){
                var dst_base = build_data.config.assets_copy_to_subdir ? path.join(output_directory, build_data.config.assets_copy_to_subdir) : output_directory;
                async.each(
                    files,
                    function(file, callback){
                        var src = path.join(input_directory, '_assets', file);
                        var dst = path.join(dst_base, file);
                        log.verbose('\t\t', colors.gray(sprintf('Copying %s',file)), '\n');
                        ncp(src, dst, callback);
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

var remove_old_files = function(output_directory, callback){
    var start = moment();
    var files;
    log.verbose(colors.gray.bold('\nRemoving old files... \n'));
    async.series(
        [
            function(callback){
                log.verbose('\t', colors.gray(sprintf('Reading files....')), '\n');
                fs.readdir(output_directory, function (err, result) {
                    files = result;
                    callback(err);
                });
            },
            function(callback){
                async.each(files, function(file, callback){
                    var abs = path.resolve(output_directory, file);
                     log.verbose('\t\t', colors.gray(sprintf('Removing %s',file)), '\n');
                    fs.remove(abs, callback);
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

var write_search_index = function(build_data, output_directory, callback){
    var start = moment();
    var p = path.join(output_directory, 'site.json');
    log.verbose(colors.gray.bold('\nWriting search.json... \n'));
    fs.writeJSON(p, build_data.search_index, function(err){
        if (! err){
            log.verbose('\t', colors.gray(sprintf('Done writing search.json in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
        }
        callback(err);
    });

};





