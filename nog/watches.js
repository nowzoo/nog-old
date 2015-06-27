/* jshint node: true */
module.exports = function (grunt) {
    'use strict';


    grunt.config.merge({
        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: ['./_site/**/*']
            },
            build: {
                files: ['./nog_content/**/*', './nog_templates/**/*', './nog_assets/**/*'],
                tasks: ['build']
            }
        }
    });

};
