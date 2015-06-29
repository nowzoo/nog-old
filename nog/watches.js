/* jshint node: true */
module.exports = function (grunt) {
    'use strict';


    grunt.config.merge({
        watch: {
          nog: {

          },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['./_site/updated.json']
            },
            build_content: {
                files: ['_content/**/*', '_templates/**/*', '_assets/**/*'],
                tasks: ['build']
            }
        }
    });

};
