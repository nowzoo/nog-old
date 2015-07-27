'use strict';
var glob = require('glob');
var path = require('path');
var _ = require('lodash');

module.exports = function(build, callback){
    var p = path.join(build.input_directory, '_cfg', '**', '*.js');
    glob(p, function(err, result){
        //console.log(result);
        _.each(result, function(module_path){
            delete require.cache[require.resolve(module_path)];
        });

        callback(err);
    });

};