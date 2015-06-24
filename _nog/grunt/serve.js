/* jshint node: true */
module.exports = function (grunt, done) {
    'use strict';
    var path = require('path');
    var express = require('express');
    var app = express();
    var port = 3000;
    app.use(express.static('_site'));
    app.listen(port, function (err) {
        if (err) {
            grunt.log.err(err);
        } else {
            grunt.log.oklns('Server listening on port %s. Go to  http://localhost:%s', port, port);
            grunt.log.oklns('Press ^C to stop.')

        }
    });







};


