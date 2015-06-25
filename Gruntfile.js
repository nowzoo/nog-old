/* jshint node: true */
module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    var _ = require('lodash');
    var moment = require('moment');



    var init = require('./grunt/init');
    var show = require('./grunt/show');
    var build = require('./grunt/build');
    var push = require('./grunt/push');
    var get_data = require('./grunt/get_data');

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';




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
        },
        watch: {
            nog: {
                files: ['content/**/*', 'templates/**/*', 'assets/**/*'],
                tasks: 'build'
            }
        }
    });

    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
    require('time-grunt')(grunt);

    grunt.registerTask('init', 'Initialize the site.', function() {

        var done = this.async();
        init.call(this, grunt, done);
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

    grunt.registerTask('show', 'Show site data.', function(what) {
        var done = this.async();
        what = Array.prototype.slice.call(arguments);
        get_data(grunt, function(err, data){
            if (err) return done(err);
            show.call(this, grunt, what, data);
            done(err);
        });

    });

    grunt.registerTask('push', 'Commit and push site changes to GitHub.', function() {
        var done = this.async();
        push.call(this, grunt, done);

    });

    

    // Default distribution task.
    grunt.registerTask('default', function(){
        grunt.log.writeln(grunt.config.get('nog.title'));
    });
};

