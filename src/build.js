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
    var changed_uris = [];

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



            //get the data...
            function(callback){
                data.read(input_directory, is_build_public, function(err, result){
                    build_data = result;
                    callback(err);
                });
            },

            //delete the existing files...
            function(callback){
                remove_old_files(build_data, output_directory, changed_uris, callback);
            },

            //write the atomic contents...
            function(callback){
                write_contents(build_data, output_directory, changed_uris, callback);
            },
            //write the archives...
            function(callback){

                write_archives(build_data, output_directory, changed_uris, callback);
            },

            //copy _assets...
            function(callback){
                copy_assets(build_data, input_directory, output_directory, changed_uris, callback);
            },

            //write search index...
            function(callback){
                write_search_index(build_data, output_directory, changed_uris, callback);
            },

            //write the .built.json file...
            function(callback){
                write_built(build_data, output_directory, callback);
            }
        ],
        function (err) {
            if (! err){
                log.verbose(colors.gray.bold(sprintf('\nSite built in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
            }
            callback(err, changed_uris);
        }
    );
};

var write_contents = module.exports.write_contents = function(build_data, output_directory, changed_uris, callback){
    var start = moment();
    log.verbose(colors.gray.bold('\nWriting atomic content... \n'));
    async.eachSeries(build_data.contents, function(content, callback){
        write_content(build_data, content, output_directory, changed_uris, callback);
    }, function(err){
        if (! err){
            log.verbose('\t', colors.gray(sprintf('Done writing atomic content in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
        }
        callback(err);
    });
};

var write_content = module.exports.write_content = function(build_data, content, output_directory, changed_uris, callback){
    var rel_p;
    var p;
    var uri = atomic.get_uri(build_data, content);
    var template;
    var rel_template;
    var passed;
    var ignored;
    var rendered;
    var start = moment();
    var slugs = uri.split('/');


    log.verbose(colors.gray(sprintf('\tProcessing %s... \n', content.relative_path)));
    changed_uris.push(atomic.get_relative_url(build_data, content));
    ignored = content_is_ignored(build_data, content);
    if (ignored){
        log.verbose(colors.gray(sprintf('\t\tIgnoring %s: %s\n', content.relative_path, ignored)));
        callback(null);
    } else {
        template = atomic.get_template(build_data, content);
        rel_template = path.relative(build_data.input_directory, template);
        p = path.join(output_directory, atomic.get_output_path(build_data, content));
        rel_p = path.relative(output_directory, p);
        passed = {
            post: content,
            site: build_data.config,
            site_root: 0 < build_data.config.prefix.length ? '/' + build_data.config.prefix + '/' : '/'
        };
        async.series(
            [
                function(callback){
                    swig.setDefaults({ cache: false });
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

var write_archives = module.exports.write_archives = function(build_data, output_directory, changed_uris, callback){
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
    async.eachSeries(archives, function(archive, callback){
        write_archive(build_data, archive, output_directory, changed_uris, callback);
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

var write_archive = module.exports.write_archive = function(build_data, archive, output_directory, changed_uris, callback){
    var p;
    var uri;
    var template;
    var passed;
    var start = moment();

    template = path.join(process.cwd(), '_templates', 'archive.twig');

    log.verbose(colors.gray(sprintf('\tProcessing the %s archive "%s"... \n', archive.type, archive.title)));

    async.eachSeries(archive.pages, function(page, callback){
        var out;
        log.verbose(colors.gray(sprintf('\t\tProcessing page %s of %s... \n', page.page + 1, archive.page_count)));
        changed_uris.push(page.relative_url);
        passed = {
            archive: archive,
            page: page,
            site: build_data.config,
            site_root: 0 < build_data.config.prefix.length ? '/' + build_data.config.prefix + '/' : '/'

        };
        p = path.join(output_directory, page.slugs.join(path.sep), 'index.html');
        async.series(
            [
                function (callback) {
                    swig.setDefaults({ cache: false });
                    swig.renderFile(template, passed, function(err, result){
                        out = result;
                        callback(err);
                    });
                },
                function(callback) {
                    fs.outputFile(p, out, callback);
                }
            ], callback
        )

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

var copy_assets = function(build_data, input_directory, output_directory, changed_uris, callback){
    var start = moment();
    var files;
    var src_assets_path = path.join(input_directory, '_assets');
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
                var dst_base_slugs = [];
                if (0 < build_data.config.prefix.length){
                    dst_base_slugs.push(build_data.config.prefix);
                }
                if (build_data.config.assets_copy_to_subdir){
                    dst_base_slugs.push(build_data.config.assets_copy_to_subdir);
                }
                var dst_base = output_directory;
                if (0 < dst_base_slugs.length && ! build_data.is_build_public){
                    dst_base = path.join(dst_base, dst_base_slugs.join(path.sep));
                }
                async.eachSeries(
                    files,
                    function(file, callback){
                        var rel = path.relative(src_assets_path, file);
                        var src = path.join(src_assets_path, rel);
                        var dst = path.join(dst_base, rel);
                        var slugs = dst_base_slugs.concat(rel.split(path.sep));
                        var uri = '/' + slugs.join('/');
                        changed_uris.push(uri);
                        log.verbose('\t\t', colors.gray(sprintf('Copying %s. URI: %s',rel, uri)), '\n');
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

var remove_old_files = function(build_data, output_directory, changed_uris, callback){
    var start = moment();
    var files;
    log.verbose(colors.gray.bold('\nRemoving old files... \n'));
    async.series(
        [

            function(callback){
                log.verbose('\t', colors.gray(sprintf('Reading files....')), '\n');
                var p = path.join(output_directory, '**', '*.*');
                glob(p, function (err, result) {
                    files = result;
                    _.each(files, function(file){
                        var rel = path.relative(output_directory, file);
                        var slugs = rel.split(path.sep);
                        changed_uris.push('/' + slugs.join('/'));
                    });
                    callback(err);
                });
            },
            function(callback){
                async.each(files, function(file, callback){
                    var abs = path.resolve(output_directory, file);
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

var write_search_index = function(build_data, output_directory, changed_uris, callback){
    var start = moment();
    var p;
    var slugs = ['search.json'];
    var uri;
    if (0 < build_data.config.prefix.length && ! build_data.is_build_public){
        slugs.unshift(build_data.config.prefix);
    }
    uri = '/' + slugs.join('/');
    changed_uris.push(uri);
    log.verbose(colors.gray.bold('\nWriting search.json... \n'));

    p =  path.join(output_directory, slugs.join(path.sep));
    fs.writeJSON(p, build_data.search_index, function(err){
        if (! err){
            log.verbose('\t', colors.gray(sprintf(
                'Done writing search.json in %ss. URI: %s',
                (moment().valueOf() - start.valueOf())/1000,
                        uri
                    )

                ), '\n'
            );
        }
        callback(err);
    });

};

var write_built = function(build_data, output_directory, callback){
    var start = moment();
    var p = path.join(output_directory, '.built.json');
    log.verbose(colors.gray.bold('\nWriting .built.json... \n'));
    fs.writeJSON(p, {built: moment(), prefix: build_data.config.prefix}, function(err){
        if (! err){
            log.verbose('\t', colors.gray(sprintf('Done writing .built.json in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
        }
        callback(err);
    });

};





