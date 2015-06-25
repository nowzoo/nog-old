/* jshint node: true */
module.exports = function (grunt, what, data) {
    'use strict';

    var _ = require('lodash');
    var sprintf = require('sprintf-js').sprintf;



    var header = function(title){
        var sep = '--------------';
        grunt.log.subhead(sep, title, sep);
    };
    var errors = function(errors){
        if (errors.length > 0){
            grunt.log.writeln('Errors (%s)', errors.length);
            _.each(errors, function(e, i){
                grunt.log.writeln( ' ' + (i + 1) + '.', e);
            })
        }
    };


    var show_site = function () {
        grunt.log.writeln('');
        header('Site Options');
        grunt.log.writeln('');
        _.each(data.site, function(value, key){
            var text;
            if (_.isFunction(value)){
                text =  '[function]';
            } else {
                text = value
            }
            grunt.log.writeln(key + ':',  text);
        });
        grunt.log.writeln('');
    };

    var show_index = function () {
        grunt.log.writeln('');
        header('Home Page');
        grunt.log.writeln('');
        var post = data.index;
        grunt.log.writeln(post.title);
        grunt.log.writeln('ID:',  post.id);
        grunt.log.writeln('Path:',  post.path);
        grunt.log.writeln('Type:',post.type);
        grunt.log.writeln('Published:',post.published_at.format('LLLL'));
        errors(post.errors);
        grunt.log.writeln('');
    };

    var show_pages = function(){
        grunt.log.writeln('');
        header(sprintf('Pages (%s)', _.size(data.pages)));
        _.each(data.pages, function(post){
            grunt.log.writeln('');
            grunt.log.writeln(post.title);
            grunt.log.writeln('ID:',  post.id);
            grunt.log.writeln('Path:',  post.path);
            grunt.log.writeln('Type:',post.type);
            grunt.log.writeln('Published:',post.published_at.format('LLLL'));
            grunt.log.writeln('Page Parent:', post.parent ? post.parent.id : '[none]');
            errors(post.errors);

        });
    };

    var show_posts = function(){
        grunt.log.writeln('');
        header(sprintf('Posts (%s)', _.size(data.posts)));
        _.each(data.posts, function(post){
            grunt.log.writeln('');
            grunt.log.writeln(post.title);
            grunt.log.writeln('ID:',  post.id);
            grunt.log.writeln('Path:',  post.path);
            grunt.log.writeln('Type:',post.type);
            grunt.log.writeln('Published:',post.published_at.format('LLLL'));
            grunt.log.writeln('Tags:', grunt.log.wordlist(post.tags));
            errors(post.errors);

        });
        grunt.log.writeln('');
    };

    var show_archives = function(){
        grunt.log.writeln('');
        header(sprintf('Date Archives (%s)', _.size(data.archives.date)));
        _.each(data.archives.date, function(archive){
            grunt.log.writeln('');
            grunt.log.writeln(archive.name);
            grunt.log.writeln('ID:',  archive.id);
            grunt.log.writeln('Path:',  archive.pages[0].path);
            grunt.log.writeln('Posts:', _.size(archive.posts));

        });
        grunt.log.writeln('');
    };

    var show_tags = function(){
        grunt.log.writeln('');
        header(sprintf('Post Tags (%s)', _.size(data.archives.tags)));
        _.each(data.archives.tags, function(archive){
            grunt.log.writeln('');
            grunt.log.writeln(archive.name);
            grunt.log.writeln('ID:',  archive.id);
            grunt.log.writeln('Path:',  archive.pages[0].path);
            grunt.log.writeln('Posts:', _.size(archive.posts));

        });
        grunt.log.writeln('');
    };

    var show_search_words = function(){
        grunt.log.writeln('');
        header(sprintf('Search Words (%s)', _.size(data.search)));
        grunt.log.writeln('');
        _.each(data.search, function(arr, word){
            grunt.log.writeln(word,  _.size(arr), 'match(es)');
        });
        grunt.log.writeln('');
    };

    var things = {
        site: [show_site, 'Site data'],
        index: [show_index, 'Home page data'],
        pages: [show_pages, 'Pages data'],
        posts: [show_posts, 'Posts data'],
        archives: [show_archives, 'Post archives data'],
        tags: [show_tags, 'Post tags data'],
        search: [show_search_words, 'Search words data']
    };

    what = what.length === 0 ? _.keys(things) : what;
    grunt.verbose.writeln('Showing site data.', grunt.log.wordlist(what));


    _.each(what, function(thing){
        if (_.has(things, thing)){
            grunt.verbose.writeln('Showing ' , things[thing][1]);
            things[thing][0]();
        } else {
            grunt.log.error('Cannot show  ' , thing, '(invalid key)');
        }
    });

    grunt.verbose.writeln('Showed site data: ', grunt.log.wordlist(what));

};



