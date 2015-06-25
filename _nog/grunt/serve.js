/* jshint node: true */
module.exports = function (grunt, done) {
    'use strict';
    var path = require('path');
    var express = require('express');
    var app = express();

    var site = grunt.config.get('nog');
    var site_prefix = site.site_prefix || '';
    var port = site.localhost_port || 3000;
    app.use(site_prefix, express.static('./'));
    app.listen(port, function (err) {
        if (err) {
            grunt.log.err(err);
        } else {
            grunt.log.oklns('Server listening on port %s. Go to  http://localhost:%s%s', port, port, site_prefix);
            grunt.log.oklns('Press ^C to stop.')

        }
    });







};


