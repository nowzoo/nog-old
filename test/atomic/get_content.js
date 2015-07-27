/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var moment = require('moment');

var get_content = require('../../src/atomic/get_content');
var default_render_markdown = require('../../src/render/markdown');

var diff_render_markdown = function(str, callback){
    callback(null, 'The quick brown fox.')
};

var err_render_markdown = function(str, callback){
    callback(new Error('Test error.'), null)
};

describe('#atomic/get_content()', function() {


    it('should callback with an error, and an empty string if content.meta.__content is an empty string', function (done) {
        var site = {render_markdown: default_render_markdown};
        var content = {meta: {__content: ''}, relative_path: 'foo-bar.md'};
        get_content(site, content, function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.equal('');
            done();
        });


    });

    it('should callback with no err, with lint, and an empty string if content.meta.__content is an whitespace string', function (done) {
        var site = {render_markdown: default_render_markdown};
        var content = {meta: {__content: '   '}, relative_path: 'foo-bar.md'};
        get_content(site, content, function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.equal('');
            done();
        });


    });

    it('should callback with no err, no lint, and a marked up string if content.meta.__content is a string', function (done) {
        var site = {render_markdown: default_render_markdown};
        var content = {meta: {__content: 'Foo bar'}, relative_path: 'foo-bar.md'};
        get_content(site, content, function(err, result){
            expect(err).to.be.null;
            expect(result).to.equal('<p>Foo bar</p>\n');
            done();
        });


    });

    it('should callback with no err, no lint, and a string if we replace site.render_markdown with something else', function (done) {
        var site = {render_markdown: diff_render_markdown};
        var content = {meta: {__content: 'Foo bar'}, relative_path: 'foo-bar.md'};
        get_content(site, content, function(err, result){
            expect(err).to.be.null;
            expect(result).to.equal('The quick brown fox.');
            done();
        });


    });
    it('should callback with the err that site.render_markdown calls back with', function (done) {
        var site = {render_markdown: err_render_markdown};
        var content = {meta: {__content: 'Foo bar'}, relative_path: 'foo-bar.md'};
        get_content(site, content, function(err, result){
            expect(err).to.be.an('error');
            expect(err.message).to.equal('Test error.');
            done();
        });


    });



});