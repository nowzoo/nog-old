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

    var nog = require('./nog')


    grunt.registerTask('nog', function () {
        var done = this.async();
        nog.start.call(this, grunt, done);
        //grunt.file.write(p, JSON.stringify(o));
    });



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
