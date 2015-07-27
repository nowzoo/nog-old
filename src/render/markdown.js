'use strict';
var _ = require('lodash');
var marked = require('marked');
var highlight = require('highlight.js');
var sprintf = require('sprintf-js').sprintf;

module.exports = function(markdown_string, callback){

    if (! _.isString(markdown_string)){
        callback(new Error('The markdown_render function needs to be passed a string.'))
    } else {
        marked.setOptions({
            highlight: function (code) {
                return highlight.highlightAuto(code).value;
            }
        });
        callback(null, marked(markdown_string.trim()));
    }

};
