'use strict';
var async = require('async');
var _ = require('lodash');

var read_default = require('./read_default');
var read_user = require('./read_user');
var merge = require('./merge');

module.exports = function(build, callback) {
    async.series(
        [
            function(callback){
                read_default(callback);
            },
            function(callback){
                read_user(build, callback);
            }
        ],
        function(err, results){
            var lint = {};
            var config = merge(results[0], results[1], lint);
            if (! err && 0 < _.size(lint)){
                err = new Error('Some problems with your _cfg/site.json were found.');
                err.lint = lint;
            }
            callback(err, config);

        }
    );
};


