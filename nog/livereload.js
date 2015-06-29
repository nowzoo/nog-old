#!/usr/bin/env node
/* jshint node: true */
'use strict';

var async = require('async');
var tinylr = require('tiny-lr');
var gaze = require('gaze');
var child_process = require('child_process');
var sprintf = require('sprintf-js').sprintf;


// standard LiveReload port
var livereload_port = 35729;

var folder = process.cwd();
var site_prefix = process.argv[2];

// tinylr(opts) => new tinylr.Server(opts);
tinylr().listen(livereload_port, function(err) {
    var info;
    info = {
        message: 'started',
        port: livereload_port,
        url: 'http://localhost:' + livereload_port,
        err: err || null
    };
    process.send(info);
});
