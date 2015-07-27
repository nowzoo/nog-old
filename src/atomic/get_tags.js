'use strict';
var _ = require('lodash');
var S = require('string');


module.exports = function(content){
    var tags;
    var clean = [];
    var exists = [];
    var normalized;

    if (!_.has(content.meta, 'tags')){
        tags = [];
    } else {
        if (_.isString(content.meta.tags)){
            tags = content.meta.tags.split(',');
        } else {
            if (_.isArray(content.meta.tags)){
                tags = content.meta.tags;
            } else {
                tags = [];
            }
        }

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
