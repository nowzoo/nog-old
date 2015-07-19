module.exports.validate_slug = function(slug){
    'use strict';
    var _ = require('lodash');
    var S = require('string');
    if (!_.isString(slug)) return false;
    if (S(slug).trim().s !== slug) return false;
    if (! /^[a-z0-9\-]+$/.test(slug))return false;
    if (/\-\-/.test(slug))return false;
    if (/^\-/.test(slug)) return false;
    if (/\-$/.test(slug)) return false;
    return true;
};
