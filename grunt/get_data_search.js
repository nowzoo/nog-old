/* jshint node: true */
module.exports = function (grunt, posts, callback) {
    'use strict';
    var _ = require('lodash');
    var S = require('string');


    var search = {};

    grunt.verbose.writeln('Gathering search index data.');

    var add_search_word = function(word, path, title, excerpt, type, id){
        word = S(word).trim().toLowerCase().s;
        grunt.verbose.writeln('Adding word "%s".', word);
        if (! _.has(search, word)){
            search[word] = [];
        }
        search[word].push({
            path: path,
            title: title,
            excerpt: excerpt,
            type: type,
            id: id
        });
    };

    _.each(posts, function(post){
        _.each(post.search_words, function(word){
            add_search_word(word, post.path, post.title, post.excerpt, post.type, post.id);
        })
    });

    grunt.verbose.writeln('Finished search index.');
    callback(null, search);


};


