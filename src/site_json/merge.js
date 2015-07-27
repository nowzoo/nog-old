'use strict';
var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;

var validate_slug = require('../utils/validate_slug');


module.exports = function(defaults, user, lint){
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
            if (!_.isString(user[key]) || ! validate_slug(user[key])){
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
                if (! validate_slug(user.archives_directory)){
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

    if (_.has(user, 'default_template_extension')){
        config.default_template_extension = user.default_template_extension;
    } else {
        config.default_template_extension = defaults.default_template_extension;
    }

    return config;

};