'use strict';
var _ = require('lodash');
var S = require('string');
var sprintf = require('sprintf-js').sprintf;

var get_content = require('./get_content');

module.exports = function(build, site, content, html, callback){
    var err = null;
    var excerpt;

    if (! _.has(content.meta, 'excerpt') || !_.isString(content.meta.excerpt) || 0 === content.meta.excerpt.trim().length){
        err = new Error(sprintf(
            'The content at %s does not have a defined excerpt. Using the first %s chars.',
            content.relative_path, site.excerpt_length
        ));
        if (html){
            excerpt = S(html).stripTags().trim().substring(0, site.excerpt_length).s;
            callback(err, excerpt);
        } else {
            get_content(build, site, content, function(ignore, html){
                var excerpt = S(html).stripTags().trim().substring(0, site.excerpt_length).s;
                callback(err, excerpt);
            });
        }

    } else {
        callback(err, content.meta.excerpt.trim());
    }
};
