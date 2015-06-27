/* jshint node: true */
module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    var _ = require('lodash');


    // Force use of Unix newlines
    grunt.util.linefeed = '\n';


    grunt.initConfig({
        nog: {
            title: 'Nog',
            tagline: 'A simple site generator for GitHub Pages.',
            site_url: '',
            site_prefix: '/nog',
            posts_per_page: 10
        },
        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: ['./_site/**/*']
            },
            build: {
                files: ['./content/**/*', './templates/**/*', './assets/**/*'],
                tasks: ['build']
            }
        }
    });

    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });


    require('./nog/tasks')(grunt);


    grunt.registerTask('update_readmes', 'Copies the home page md to ./README.md and assets/README.md', function(){
        var src = './content/index/index.md';
        var dst = './README.md';
        var yamlFront = require('yaml-front-matter');
        var data = yamlFront.loadFront(grunt.file.read(src));


        grunt.file.write(dst, data.__content);
        dst = './assets/README.md';
        grunt.file.write(dst, data.__content);
    });


    // Default task. Feel free to change this.
    grunt.registerTask('default', function(){
        grunt.log.oklns('Hello from %s!', grunt.config.get('nog.title'));
    });
};

