#!/usr/bin/env node
/* jshint node: true */
'use strict';

var express = require('express');
var app = express();

var folder = process.cwd();
var site_prefix = process.argv[2];
var port = process.argv[3];

app.use(site_prefix, express.static(folder));

app.listen(port, function (err) {
    var info = {
        message: 'started',
        port: port,
        url: 'http://localhost:' + port + site_prefix,
        err: err || null
    };
    process.send(info);
});
