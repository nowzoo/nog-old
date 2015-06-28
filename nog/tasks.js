/* jshint node: true */
module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    var _ = require('lodash');
    var moment = require('moment');



    var show = require('./show');
    var build = require('./build');
    var push = require('./push');
    var serve = require('./serve');
    var get_data = require('./get_data');



    grunt.registerTask('build', 'Build the site.', function() {
        var done = this.async();
        get_data(grunt, function(err, data){
            if (err) return done(err);
            build.call(this, grunt, data, function(err){
                done(err);
            });
        });

    });
    grunt.registerTask('push', 'Push site content changes to GitHub.', function() {
        var done = this.async();
        push.call(this, grunt, function(err){
            done(err);
        });

    });

    grunt.registerTask('serve', 'Serve the site locally.', function() {
        var done = this.async();
        var port = parseInt(grunt.option('port') ? grunt.option('port') : 3000);
        serve.call(this, grunt, port, done);
    });




    grunt.registerTask('show', 'Show site data.', function(what) {
        var done = this.async();
        if(grunt.option('timer')) require('time-grunt')(grunt);
        what = Array.prototype.slice.call(arguments);
        get_data(grunt, function(err, data){
            if (err) return done(err);
            show.call(this, grunt, what, data);
            done(err);
        });

    });


};
