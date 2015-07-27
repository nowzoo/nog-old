'use strict';
var fs = require('fs-extra');
var path = require('path');

module.exports = function(build, callback){

    var p = path.join(build.input_directory, '_cfg', 'pluggable.js');
    fs.exists(p, function(exists){
        var err = null;
        var pluggable = {};
        if (exists){
            try{
                pluggable = require(p);
            } catch (e){
                pluggable = {};
                err = new Error('Invalid _cfg/pluggable.js. Check whether it\'s valid javascript.');
            }

        }
        callback(err, pluggable);
    });
};