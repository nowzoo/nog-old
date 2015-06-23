/* jshint node: true */
module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    var _ = require('lodash');
    var moment = require('moment');


    var nog_build = require('./grunt/build');
    var nog_meta = require('./grunt/meta');
    var nog_publish = require('./grunt/publish');

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    require('time-grunt')(grunt);


    grunt.initConfig({
        nog: {
            title: 'Nog',
            tagline: 'A simple site generator for GitHub Pages.',
            site_url: '',
            site_prefix: '/nog',
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
        }
    });

    grunt.registerTask('meta', 'See the metadata for your site.', function () {
        nog_meta.call(this, grunt);
    });

    grunt.registerTask('build', 'Generate the site pages.', function() {
        var done = this.async();
        nog_build.call(this, grunt, done);
    });

    grunt.registerTask('publish', 'Publish the site to GitHub Pages.', function() {
        var done = this.async();
        nog_publish.call(this, grunt, done);
    });






    // Default distribution task.
    grunt.registerTask('default', function(){
        grunt.log.writeln(grunt.config.get('nog.site_name'));
    });
};

