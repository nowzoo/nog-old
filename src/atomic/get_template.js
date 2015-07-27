'use strict';
var _ = require('lodash');

var get_type = require('./get_type');

module.exports = function(site, content){
    var type = get_type(site, content);
    var template = type + site.default_template_extension;
    if (_.has(content.meta, 'template') && _.isString(content.meta.template) && 0 < content.meta.template.trim().length){
        template = content.meta.template.trim();
    }
    return template;
};