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
            asset_contents_copy_to_site_root:  true,
            page_url: function(meta, id){
                var slugs = _.clone(meta.parents);
                if (id !== 'index') slugs.push(id);
                return slugs.join('/');
            },
            post_url: function(meta, id){
                return path.join('posts', id);
            },
            tag_archive_url: function(tag, page){
                var url = path.join('tags', tag.slug);
                page = page || 0;
                if (page > 0){
                    url = path.join(url, 'page', (page + 1).toString())
                }
                return url;
            },
            archive_url: function(archive, page){
                var url = path.join('posts', archive.slug);
                page = page || 0;
                if (page > 0){
                    url = path.join(url, 'page', (page + 1).toString())
                }
                return url;
            },
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

