var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');
var S = require('string');
var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var colors = require('colors/safe');
var moment = require('moment');


var log = require('./log');
var utils = require('./utils');

var read = module.exports.read = function(input_directory, callback){
    var defaults;
    var user;
    var lint = {};

    var start = moment();
    log.verbose(colors.gray.bold('\nReading config...\n'));

    async.series(
        [
            function(callback){
                var config_path = path.join(path.dirname(__dirname), 'defaults', '_cfg', 'site.json');
                log.verbose(colors.gray('\tReading default site.json...', config_path));
                fs.readJSON(config_path, function(err, result){
                    defaults = result;
                    if (! err) log.verbose(colors.gray(' done.\n'));
                    callback(err);
                });
            },
            function(callback){
                var config_path = path.join(input_directory, '_cfg', 'site.json');
                log.verbose(colors.gray('\tReading your site.json...'));
                fs.readJSON(config_path, function(err, result){
                    if (err ){
                        user = {};
                        lint._invalid_json = sprintf('Could not read the site.json file at %s: %s', config_path, err.toString());
                    } else {
                        if (!_.isPlainObject(result)){
                            user = {};
                            lint._invalid_json = sprintf('Could not read the site.json file at %s: The JSON did not resolve to an object.', config_path);
                        } else {
                            user = result;
                        }
                    }
                    log.verbose(colors.gray(' done.\n'));
                    callback(null);
                });
            }
        ],
        function(err){
            var config = merge_config(defaults, user, lint);
            log.verbose(colors.gray('\tMerging... done.\n'));
            config.__lint = lint;
            config.__data = {
                defaults: defaults,
                user: user
            };
            if (! err){
                log.verbose(colors.gray('\tDone reading config ('));
                log.verbose(colors.gray((moment().valueOf() - start.valueOf())/1000 + 's)\n'));
                if (0 < _.size(lint)){
                    log.verbose(colors.red.bold('\tHeads up! '), colors.gray('You may want to fix the following in _cfg/site.json:'), '\n');
                    _.each(lint, function(str, key){
                        log.verbose('\t\t', colors.gray(str), '\n');

                    })
                }

            }
            callback(err, config);
        }
    )
};

var merge_config = module.exports.merge_config = function(defaults, user, lint){
    var config = {};
    var valid;

    //optional strings that should be non-empty if set...
    _.each(['title', 'tagline', 'archives_tag_title_format', 'archives_title'], function(key){
        if (_.has(user, key)){
            if (!_.isString(user[key]) || 0 === user[key].trim().length){
                lint[key] = sprintf('Invalid %s. Reverting to defaults: %s', key, defaults[key]);
                config[key] = defaults[key];
            } else {
                config[key] = user[key].trim();
            }
        }  else {
            config[key] = defaults[key];
        }
    });


    //all these are optional...
    _.each(['year', 'month', 'day'], function(date_key){
        _.each(['title', 'slug', 'name'], function(purpose_key){
            var key = 'archives_' + date_key + '_' + purpose_key + '_format';
            if (_.has(user, key)){
                if (!_.isString(user[key]) || 0 === user[key].trim().length){
                    lint[key] = sprintf('Invalid %s. Reverting to defaults: %s', key, defaults[key]);
                    config[key] = defaults[key];
                } else {
                    config[key] = user[key].trim();
                }
            }  else {
                config[key] = defaults[key];
            }
        })
    });

    //optional booleans
    _.each(['archives_generate_dates', 'archives_generate_tags', 'assets_copy_to_subdir'], function(key){
        if (_.has(user, key)){
            if (!_.isBoolean(user[key])){
                lint[key] = sprintf('Invalid %s. Reverting to defaults: %s', key, defaults[key]);
                config[key] = defaults[key];
            } else {
                config[key] = user[key];
            }
        }  else {
            config[key] = defaults[key];
        }
    });

    //optional strings that should be slugs...
    _.each(['archives_tag_slug', 'archives_page_slug'], function(key){
        if (_.has(user, key)){
            if (!_.isString(user[key]) || ! utils.validate_slug(user[key])){
                lint[key] = sprintf('Invalid %s. Reverting to default: %s', key, defaults[key]);
                config[key] = defaults[key];
            } else {
                config[key] = user[key].trim();
            }
        }  else {
            config[key] = defaults[key];
        }
    });

    if (_.has(user, 'archives_directory')){
        valid = true;
        if (!_.isString(user.archives_directory)){
            valid = false;
        } else {
            user.archives_directory = user.archives_directory.trim();
            if (0 < user.archives_directory.length){
                if (! utils.validate_slug(user.archives_directory)){
                    valid = false;
                }
            }
        }
        if (! valid){
            lint.archives_directory = sprintf('Invalid archives_directory. Reverting to default: %s', defaults.archives_directory);
            config.archives_directory = defaults.archives_directory;
        } else {
            config.archives_directory = user.archives_directory;
        }
    } else {
        config.archives_directory = defaults.archives_directory;
    }




    // optional ints that should be >= 0...
    _.each(['excerpt_length', 'archives_posts_per_page'], function(key){
        if (_.has(user, key)){
            var val = parseInt(user[key]);
            if (isNaN(val) || 0 > val){
                lint[key] = sprintf('Invalid value for %s: (%s). Reverting to default: %s', key, user[key], defaults[key]);
                config[key] = defaults[key];
            } else {
                config[key] = val;
            }
        }  else {
            config[key] = defaults[key];
        }
    });

    //deal with the url...
    if (_.has(user, 'url')){
        if (!_.isString(user.url) || ! /^https?:\/\//.test(user.url.trim())){
            lint.url = sprintf('Invalid URL. Reverting to default: %s', defaults.url);
            config.url = defaults.url;
        } else {
            config.url = user.url.trim().replace(/\/$/,'');
        }
    }  else {
        config.url = defaults.url;
    }

    //deal with the prefix...
    if (_.has(user, 'prefix')){
        valid =  true;
        if (!_.isString(user.prefix)){
            valid = false;
        } else {
            user.prefix = user.prefix.trim().replace(/^\/|\/$/g,'');
            if (/\//.test(user.prefix)){
                valid = false;
            }
        }
        if (valid){
            config.prefix = user.prefix;
        } else {
            lint.prefix = sprintf('Invalid prefix. Reverting to default: %s', defaults.prefix);
            config.prefix = defaults.prefix;
        }
    }  else {
        config.prefix = defaults.prefix;
    }

    //deal with  content_extensions...
    if (_.has(user, 'content_extensions')){
        valid =  true;
        if (!_.isArray(user.content_extensions)){
            valid = false;
        } else {
            _.each(user.content_extensions, function(ext){
                if (! /^\.\w+$/.test(ext)){
                    valid = false;
                }
            });
        }
        if (valid){
            config.content_extensions = user.content_extensions;
        } else {
            lint.content_extensions = sprintf('Invalid content_extensions. Reverting to default: %s', defaults.content_extensions);
            config.content_extensions = defaults.content_extensions;
        }
    }  else {
        config.content_extensions = defaults.content_extensions;
    }

    return config;

};
