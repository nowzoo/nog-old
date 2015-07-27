'use strict';
var path = require('path');
var async = require('async');
var glob = require('glob');

var read = require('./read');

module.exports = function(build, callback){
    var files;
    var contents = {};
    var content_directory = path.join(build.input_directory, '_content');

    async.series(
        [
            function(callback){
                var p = path.join(content_directory, '**', '*.*');
                glob(p, function(err, result){
                    files = result;
                    callback(err);
                })
            },
            function(callback){
                async.each(
                    files,
                    function(absolute_path, callback){
                        var relative_path = path.relative(content_directory, absolute_path);
                        read(build, absolute_path, function(err, result){
                            contents[relative_path] = result;
                            callback(err);
                        });
                    },
                    callback
                );
            }
        ],
        function(err){
            callback(err, contents);
        }
    );

};
