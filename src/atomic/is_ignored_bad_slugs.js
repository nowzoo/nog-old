'use strict';
var _ = require('lodash');

var validate_slug = require('../utils/validate_slug');
var get_id = require('./get_id');

module.exports = function(content){
    var ignored = false;
    var id = get_id(content);
    var parts = id.split('/');
    if ('' !== id){
        _.each(parts, function(slug){
            if (! validate_slug(slug)){
                ignored = true;
            }
        });
    }
    return ignored;
};
