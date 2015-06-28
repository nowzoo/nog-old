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
                files: ['nog_content/**/*', 'nog_templates/**/*', 'nog_assets/**/*'],
                tasks: ['build']
            }
        }
    });

};
