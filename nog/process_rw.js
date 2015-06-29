/* jshint node: true */
'use strict';
var async = require('async');
var fs = require('fs');
var path = require('path');

var get_filepath = module.exports.get_filepath = function(){
    var p = path.join(process.cwd(), '.grunt', 'nog', 'pids.json');
    return p;
};


module.exports.read = function (grunt, callback) {

    var fp = get_filepath();
    var o = null;
    var exists;



    async.series(
        [
            function(callback){
                fs.exists(fp, function(result){
                    exists = result;
                    callback(null);
                });
            },

            //read...
            function(callback){
                if (! exists) return callback(null);
                fs.readFile(fp, {encoding: 'utf8'}, function(err, result){
                    var o_test;
                    if (err) return callback(err);
                    try{
                        o_test = JSON.parse(result);
                        o = o_test;
                        callback(null);
                    } catch(e){
                        callback(e);
                    }
                })
            }

        ],
        function(err){
            callback(err, o);
        }
    )


};

module.exports.write = function (grunt, o, callback) {

    var fp = get_filepath();
    async.series(
        [
            //write...
            function(callback){
                var json = JSON.stringify(o);
                fs.writeFile(fp, json, callback);
            }

        ],
        callback
    )
};

module.exports.delete = function (grunt, o, callback) {
    var fp = get_filepath();
    fs.unlink(fp, callback);
};
