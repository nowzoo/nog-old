/* jshint node: true */
module.exports = function (grunt) {
    'use strict';
    var _ = require('lodash');
    var moment = require('moment');
    var gather_metadata = require('./gather_metadata');



    var meta = gather_metadata.call(this, grunt);
    grunt.log.write('--------------');
    grunt.log.subhead('Atomic Content');
    grunt.log.writeln('--------------');
    grunt.log.writeln('The following atomic content exists:');
    grunt.log.writeln();
    _.each(meta.atomic_metadata, function(post){
        grunt.log.subhead(post.title);
        grunt.log.writeln('ID:',  post.id);
        grunt.log.writeln('Relative URL:',  post.relative_url);
        grunt.log.writeln('Type:',post.post_type);
        grunt.log.writeln('Published:',post.published_at.format('LLLL'));

        //grunt.log.writeln('fstat:',post.content_file_stats);
        if (post.post_type === 'post'){
            grunt.log.writeln('Tags:', grunt.log.wordlist(post.tags));
            grunt.log.writeln('Primary Tag:', post.primary_tag);
        } else {
            grunt.log.writeln('Page Parent:', post.parent);

            grunt.log.writeln('Parents:', grunt.log.wordlist(post.parents));
        }

        if (_.has(meta.atomic_errors, post.id)){
            grunt.log.error('Errors:',  meta.atomic_errors[post.id].length);
            _.each(meta.atomic_errors[post.id], function(e, i){
                grunt.log.writeln('\t' + (i + 1) + '.', e)
            })
        }
        grunt.log.writeln();
    });
    grunt.log.writeln();


    grunt.log.write('--------');
    grunt.log.subhead('Archives');
    grunt.log.writeln('--------');
    grunt.log.writeln('The following post archives were found:');
    _.each([].concat(meta.archives, meta.tag_archives), function(archive){
        grunt.log.subhead(archive.title);
        grunt.log.writeln('Slug:', archive.slug);
        grunt.log.writeln('Type:', archive.type);
        grunt.log.writeln('Title:', archive.title);
        grunt.log.writeln('Relative URL:', archive.pages[0].relative_url);
        grunt.log.writeln('Number of Posts:', archive.posts.length, grunt.log.wordlist(archive.posts));
        grunt.log.writeln('Number of Archive Pages:', archive.pages.length);

    });

    grunt.log.writeln();

    grunt.log.write('------');
    grunt.log.subhead('Assets');
    grunt.log.writeln('------');
    _.each(meta.assets, function(file){
        grunt.log.writeln(file);

    });


    grunt.log.write('------');
    grunt.log.subhead('Errors');
    grunt.log.writeln('------');
    _.each(meta.atomic_errors, function(arr, id){
        grunt.log.subhead(id, '['+ _.size(arr) + ' error(s)]');
        _.each(arr, function(e, i){
            grunt.log.writeln('\t' + (i + 1) + '.', e)
        });

    });

};


