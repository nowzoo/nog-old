/* jshint node: true */
module.exports = function (options) {
    'use strict';

    var moment = require('moment');
    var path = require('path');
    var async = require('async');
    var colors = require('colors/safe');
    var sprintf = require('sprintf-js').sprintf;
    var temp = require('temp').track();
    var child_process = require('child_process');
    var gaze = require('gaze');
    var express = require('express');
    var tinylr = require('tiny-lr');
    var glob = require('glob');
    var fs = require('fs-extra');
    var _ = require('lodash');
    var ncp = require('ncp').ncp;


    var log = require('./log');


    var start = moment();

    var dirs = ['_assets', '_cfg', '_content', '_templates'];

    log(colors.bold.blue('\nInitializing Nog...\n'));


    async.series(

        [
            function (callback) {

                var extant = [];
                async.eachSeries(
                    dirs,
                    function(d, callback){
                        var p = path.join(process.cwd(), d);
                        fs.exists(p, function(exists){
                            if (exists) extant.push(d);
                            callback(null);
                        });
                    },
                    function(){
                        var err = null;
                        if(0 < extant.length){
                            err = new Error(
                                'Sorry. Cannot do that. Existing directories would be overwritten: ' +
                                extant.join(', ') +
                                '. Delete these directories by hand if you really mean to overwrite them.'
                            );
                        }
                        callback(err);
                    }
                );
            },

            function (callback) {
                async.eachSeries(dirs, function(d, callback){
                    var src = path.join(path.dirname(__dirname), d);
                    var dst = path.join(process.cwd(), d);
                    ncp(src, dst, callback);
                }, callback);
            }


        ],

        function(err){
            if (! err){
                log('\n', colors.bold.blue(sprintf('Nog initialized in %ss.\n\n', (moment().valueOf() - start.valueOf())/1000)), '\n');

            } else {
                log('\n', colors.red.bold(err), '\n\n');
            }
        }
    )
};
