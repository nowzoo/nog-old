var _ = require('lodash');
var async = require('async');
var config = require('./config');
module.exports = function(grunt, callback){


    var cfg;

    var log_config = function(cfg){
        var combined_keys = _.uniq([].concat(_.keys(cfg.__data.user), _.keys(cfg.__data.defaults)));
        combined_keys.sort();
        _.each(combined_keys, function(key){
            grunt.log.writetableln([40, 40, 40] , [key + ':', cfg[key].toString(), typeof cfg[key]]);


        });
    };


    async.series(
        [

            function(callback){
                grunt.verbose.writeln('Getting config...');
                config.read(process.cwd(), function(err, result){
                    cfg = result;
                    callback(err);
                });

            }


        ],
        function(err){
            log_config(cfg);
            grunt.log.subhead('done');
            //_.each(cfg.__lint, function(str, key){
            //    grunt.log.errorlns(key, str);
            //})
            callback(err);
        }
    )
};


