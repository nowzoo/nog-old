'use strict';
var async = require('async');
var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var glob = require('glob');
var fs = require('fs');
//var utils = require('./utils');
var S = require('string');
var marked = require('marked');
var yamlFront = require('yaml-front-matter');
var sprintf = require('sprintf-js').sprintf;

var utils = require('./utils');

var date_formats = module.exports.date_formats = [ 'YYYY/MM/DD', 'YYYY/MM/DD HH:mm', 'YYYY/MM/DD H:mm'];
var excerpt_regex = module.exports.excerpt_regex = /<!--(\s+)?excerpt(\s+)?-->/g;




var read = module.exports.read = function(build_data, absolute_path,  callback){

    async.series(
        [
            function(callback){
                fs.stat(absolute_path, callback);
            },
            function(callback){
                fs.readFile(absolute_path, callback);
            }
        ],
        function(err, results){
            var stat = results[0] || {};
            var atomic_data = results[1] || '';
            var content;
            if (err){
                content = null;
            } else {
                content = {};
                content.meta = yamlFront.loadFront(atomic_data);
                content.absolute_path = absolute_path;
                content.relative_path = path.relative(build_data.content_directory, absolute_path);
                content.stat = stat;
                content.lint = {};
            }

            callback(err, content);
        }
    )

};

var get_basename = module.exports.get_basename = function(build_data, content){
    return path.basename(content.relative_path, path.extname(content.relative_path));
};

var get_uri = module.exports.get_uri = function(build_data, content){
    var basename = get_basename(build_data, content);
    var parts = content.relative_path.split(path.sep);
    parts.pop();
    if ('index' !== basename){
        parts.push(basename);
    }
    return parts.join('/');

};



var get_type = module.exports.get_type = function(build_data, content){
    var type;
    var uri = get_uri(build_data, content);
    if ('' === uri){
        type = 'index';
    } else {

        if (0 < build_data.config.archives_directory.length){
            if (0 === uri.indexOf(build_data.config.archives_directory + '/')){
                type = 'post';
            } else {
                type = 'page';
            }
        } else {
            type = 'page';
        }
    }
    return type;
};




var get_published = module.exports.get_published = function(build_data, content){
    if (!_.has(content.meta, 'published')) return true;
    if (!_.isBoolean(content.meta.published)){
        content.lint.published = sprintf('Invalid published value in %s. Must be either true or false. Setting published to true.', content.relative_path);
        return true;
    }
    if (! content.meta.published){
        if (build_data.is_build_public){
            content.lint.published = sprintf('The content at %s is marked as unpublished.', content.relative_path);
        } else {
            content.lint.published = sprintf('The content at %s is marked as unpublished but you will be able to preview it locally.', content.relative_path);
        }

    }


    return build_data.is_build_public ? content.meta.published: true;
};



var get_title = module.exports.get_title = function(build_data, content){
    var basename;
    if (!_.has(content.meta, 'title') || !_.isString(content.meta.title) || 0 === content.meta.title.trim().length){
        basename = get_basename(build_data, content);
        content.lint.title = sprintf('The title is missing or invalid in %s. Setting title to "%s".', content.relative_path, basename);
        return basename;
    } else {
        return content.meta.title.trim();
    }
};







var get_date = module.exports.get_date = function(build_data, content){
    var val;
    var m;
    if (!_.has(content.meta, 'date') || !_.isString(content.meta.date)){
        m = moment(content.stat.mtime);
        content.lint.date = sprintf('The date is missing in %s. Setting date to the file modified date "%s".', content.relative_path, m.format('LLLL'));
    } else {
        val = content.meta.date.trim();
        m = moment(val, date_formats, true);
        if (! m.isValid()){
            m = moment(content.stat.mtime);
            content.lint.date = sprintf('The date is invalid in %s. Setting date to the file modified date "%s".', content.relative_path, m.format('LLLL'));
        }
    }
    return m;
};




var get_content = module.exports.get_content = function(build_data, content){
    var clean = content.meta.__content.replace(excerpt_regex, '').trim();
    var html = marked(clean);
    if (0 === html.length){
        content.lint.content = sprintf('The content at %s is empty.', content.relative_path);
    }
    return html.trim();
};







var get_excerpt = module.exports.get_excerpt = function(build_data, content){

    var excerpt;
    var parts = content.meta.__content.split(excerpt_regex);
    if (1 < parts.length) {
        excerpt = parts[0].trim();
    } else {
        excerpt = '';
    }
    if (0 < excerpt.length){
        return S(marked(excerpt)).stripTags().trim().s;
    }

    if (! _.has(content.meta, 'excerpt') || !_.isString(content.meta.excerpt) || 0 === content.meta.excerpt.trim().length){
        content.lint.excerpt = sprintf(
            'The content at %s does not have a defined excerpt. Using the first %s chars.',
            content.relative_path, build_data.config.excerpt_length
        );
        excerpt = marked(content.meta.__content.replace(excerpt_regex, ''));
        return S(excerpt).stripTags().trim().substring(0, build_data.config.excerpt_length).s;
    }
    return content.meta.excerpt.trim();

};




var get_tags = module.exports.get_tags = function(build_data, content){
    var tags;
    var clean = [];
    var exists = [];
    var normalized;
    if (!_.has(content.meta, 'tags') || ! (_.isArray(content.meta.tags) || _.isString(content.meta.tags))){
        return [];
    }
    tags = content.meta.tags;

    if (_.isString(tags)){
        tags = tags.split(',');
    }

    _.each(tags, function(tag){
        if (! _.isString(tag)) return;
        tag = S(tag).trim().s;
        if (0 === tag.length) return;
        normalized = S(tag).slugify().s;
        if (exists.indexOf(normalized) === -1){
            exists.push(normalized);
            clean.push(tag);
        }
    });

    return clean;

};


var get_search_words = module.exports.get_search_words = function(build_data, content){
    var val = '';
    var tags;
    var stopwords = require('stopwords').english;

    val += ' ' + get_title(build_data, content);
    val += ' ' + get_content(build_data, content);
    val += ' ' + get_excerpt(build_data, content);


    tags = _.map(get_tags(build_data, content), function(val){return S(val).trim().toLowerCase().s});

    val = S(val).stripTags().toLowerCase().split(/\W+/);

    val  = _.difference(val, stopwords);
    //add the tags...
    val = val.concat(tags);
    val = _.filter(val, function(val) {return 0 < val.length;});
    val = _.uniq(val);
    return val;
};



var get_template = module.exports.get_template = function(build_data, content){
    var type = get_type(build_data, content);
    var default_template_by_type = type + '.twig';
    var template;
    var absolute_path;

    if (_.has(content.meta, 'template')){
        if (!_.isString(content.meta.template)){
            content.lint.template = sprintf('The template set in %s is not valid. Using %s instead.', content.relative_path, default_template_by_type);
        } else {
            template = content.meta.template.trim();
            if (!_.has(build_data.templates.user, template)){

                content.lint.template = sprintf('The template set in %s could not be found. Using %s instead.', content.relative_path, default_template_by_type);
                template = default_template_by_type;
            }
        }
    }

    template = template || default_template_by_type;
    if (!_.has(build_data.templates.user, template)){
        absolute_path = build_data.templates.defaults[template];
        content.lint.template = sprintf('The template for %s is missing. Using %s instead.', content.relative_path, absolute_path);
    } else {
        absolute_path = build_data.templates.user[template];
    }
    return absolute_path;
};



var get_relative_url = module.exports.get_relative_url = function(build_data, content){
    var uri = get_uri(build_data, content);
    var url = 0 === uri.length ? '/' : '/' + uri + '/';
    if (0 < build_data.config.prefix.length){
        url = '/' + build_data.config.prefix + url;
    }
    return url;

};

var get_absolute_url = module.exports.get_absolute_url = function(build_data, content){
    return build_data.config.url + get_relative_url(build_data, content);
};





var get_is_ignored_bad_uri = module.exports.get_is_ignored_bad_uri = function(build_data, content){
    var ignored;
    var uri = get_uri(build_data, content);
    var parts = uri.split('/');
    if ('' === uri){
        return false;
    } else {

        ignored =  false;
        _.each(parts, function(slug){
            if (! utils.validate_slug(slug)){
                ignored = true;
            }
        });
        if (ignored){
            content.lint.is_ignored_bad_uri = sprintf('The content at %s will be ignored. Bad URI: "%s".', content.relative_path, uri);

        }
        return ignored;
    }
};



var get_is_ignored_extension = module.exports.get_is_ignored_extension = function(build_data, content){
    var extension = path.extname(content.relative_path);
    var ignored = build_data.config.content_extensions.indexOf(extension) === -1;
    if (ignored){
        content.lint.is_ignored_extension = sprintf('The content at %s will be ignored. Unrecognized content extension: "%s".', content.relative_path, extension);
    }
    return ignored;
};


var get_is_ignored_conflicts_with_archive = module.exports.get_is_ignored_conflicts_with_archive = function(build_data, content){
    var uri = get_uri(build_data, content);
    if (_.isString(build_data.config.archives_directory) && 0 < build_data.config.archives_directory.length){
        if(uri === build_data.config.archives_directory){
            content.lint.is_ignored_conflicts_with_archive =sprintf(
                'The content at %s will be ignored. The uri conflicts with the archives uri: "%s".',
                content.relative_path,
                build_data.config.archives_directory
            );
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }

};

var get_is_ignored_overridden_by_sibling = module.exports.get_is_ignored_overridden_by_sibling = function(build_data, content){
    var possible = [];
    var first;
    var dir = path.dirname(content.absolute_path);

    _.each(build_data.config.content_extensions, function(extension){
        var p = path.join(dir, get_basename(build_data, content) + extension);
        var conflict = _.findWhere(build_data.contents, {absolute_path: p});
        if (conflict){
            if (! get_published(build_data, conflict)) return;
            possible.push(conflict);
        }
    });


    first = _.first(possible);
    if (first && first.absolute_path !== content.absolute_path){
        content.lint.is_ignored_overridden_by_sibling = sprintf(
            'The content at %s will be ignored. Overridden by %s.', content.relative_path, first.relative_path
        );
        return true;
    } else {
        return false;
    }

};

var get_is_ignored_overridden_by_index = module.exports.get_is_ignored_overridden_by_index = function(build_data, content){
    var possible = [];
    var first;
    var dir = path.dirname(content.absolute_path);

    _.each(build_data.config.content_extensions, function(extension){
        var p = path.join(dir, get_basename(build_data, content), 'index' + extension);
        var conflict = _.findWhere(build_data.contents, {absolute_path: p});
        if (conflict){
            if (get_published(build_data, conflict)){
                possible.push(conflict);
            }

        }
    });
    first = _.first(possible);
    if (first){
        content.lint.is_ignored_overridden_by_index = sprintf(
            'The content at %s will be ignored. Overridden by %s.',
            content.relative_path, first.relative_path
        );
        return true;
    } else {
        return false;
    }
};



var get_parent = module.exports.get_parent = function(build_data, content){
    var uri = get_uri(build_data, content);
    var parts = uri.split('/');
    var parent_uri;
    var possible_parents;
    var parent;

    parts.pop();
    parent_uri = parts.join('/');
    if ('' === parent_uri) return null;
    _.each(build_data.contents, function(possible_parent){
        if (get_uri(build_data, possible_parent) !== parent_uri) return;
        if (get_is_ignored_bad_uri(build_data, possible_parent)) return;
        if (get_is_ignored_extension(build_data, possible_parent)) return;
        if (get_is_ignored_conflicts_with_archive(build_data, possible_parent)) return;
        if (get_is_ignored_overridden_by_sibling(build_data, possible_parent)) return;
        if (get_is_ignored_overridden_by_index(build_data, possible_parent)) return;
        if (! get_published(build_data, possible_parent)) return;
        parent = possible_parent;
    });
    return parent ? parent : null;
};




var get_children = module.exports.get_children = function(build_data, content){
    var uri = get_uri(build_data, content);
    var children = [];


    _.each(build_data.contents, function(possible_child){
        var child_uri = get_uri(build_data, possible_child);
        var parts = child_uri.split('/');
        parts.pop();
        if (parts.join('/') !== uri) return;
        if (get_is_ignored_bad_uri(build_data, possible_child)) return;
        if (get_is_ignored_extension(build_data, possible_child)) return;
        if (get_is_ignored_overridden_by_sibling(build_data, possible_child)) return;
        if (get_is_ignored_overridden_by_index(build_data, possible_child)) return;
        if (! get_published(build_data, possible_child)) return;
        children.push(possible_child);
    });
    return children;
};

var populate_data = module.exports.populate_data = function(build_data, content){
    content.title = get_title(build_data, content);
    content.content = get_content(build_data, content);
    content.excerpt = get_excerpt(build_data, content);
    content.basename = get_basename(build_data, content);
    content.uri = get_uri(build_data, content);
    content.published = get_published(build_data, content);
    content.date = get_date(build_data, content);
    content.tags = get_tags(build_data, content);
    content.search_words = get_search_words(build_data, content);
    content.template = get_template(build_data, content);
    content.relative_url = get_relative_url(build_data, content);
    content.absolute_url = get_absolute_url(build_data, content);
    content.is_ignored_bad_uri = get_is_ignored_bad_uri(build_data, content);
    content.is_ignored_extension = get_is_ignored_extension(build_data, content);
    content.is_ignored_conflicts_with_archive = get_is_ignored_conflicts_with_archive(build_data, content);
    content.is_ignored_overridden_by_sibling = get_is_ignored_overridden_by_sibling(build_data, content);
    content.is_ignored_overridden_by_index = get_is_ignored_overridden_by_index(build_data, content);
    content.parent = get_parent(build_data, content);
    content.children = get_children(build_data, content);
};