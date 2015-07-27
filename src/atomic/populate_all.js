'use strict';
var async = require('async');

var populate = require('./populate');

module.exports = function(build, site, contents, callback){
    async.each(contents, function(content, callback){
        populate(build, site, content, contents, callback);
    }, callback);
};