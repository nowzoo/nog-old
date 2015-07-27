'use strict';
var _ = require('lodash');
var S = require('string');

var get_basename = require('./get_basename');


module.exports = function(content){
    var err = null;
    var basename;
    var title;
    if (!_.has(content.meta, 'title') || !_.isString(content.meta.title) || 0 === content.meta.title.trim().length){
        basename = get_basename(content);
        title = S(basename).humanize().s;
    } else {
        title = content.meta.title.trim();
    }
    return title;
};
