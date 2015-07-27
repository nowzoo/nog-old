'use strict';
var path = require('path');
var async = require('async');
var fs = require('fs-extra');
var yamlFront = require('yaml-front-matter');


module.exports = function(build, absolute_path,  callback){
    var content_directory = path.join(build.input_directory, '_content');
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
                content.relative_path = path.relative(content_directory, absolute_path);
                content.stat = stat;
            }

            callback(err, content);
        }
    )

};
