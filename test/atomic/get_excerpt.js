/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var moment = require('moment');

var get_excerpt = require('../../src/atomic/get_excerpt');
var default_render_markdown = require('../../src/render/markdown');


describe('#atomic/get_excerpt()', function() {


    it('should callback with an error and an empty string if content.meta.excerpt is missing and content.meta.__content is an empty string', function (done) {
        var site = {excerpt_length: 3, render_markdown: default_render_markdown};
        var content = {meta: {__content: ''}, relative_path: 'foo-bar.md'};
        get_excerpt( site, content, null, function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.equal('');
            done();
        });


    });

    it('should callback with an error and an empty string if content.meta.excerpt is missing and  content.meta.__content is an whitespace string', function (done) {
        var site = {excerpt_length: 3, render_markdown: default_render_markdown};
        var content = {meta: {__content: '   '}, relative_path: 'foo-bar.md'};
        get_excerpt(site, content, null, function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.equal('');
            done();
        });


    });

    it('should callback with an error and an empty string if content.meta.excerpt is an empty string and  content.meta.__content is an whitespace string', function (done) {
        var site = {excerpt_length: 3, render_markdown: default_render_markdown};

        var content = {meta: {__content: '   ', excerpt: '    '}, relative_path: 'foo-bar.md'};
        get_excerpt(site, content, null, function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.equal('');
            done();
        });


    });

    it('should callback with an error and a string of excerpt_length if content.meta.excerpt is an empty string', function (done) {
        var site = {excerpt_length: 3, render_markdown: default_render_markdown};

        var content = {meta: {__content: '  Good dog ', excerpt: '    '}, relative_path: 'foo-bar.md'};
        get_excerpt(site, content, null, function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.equal('Goo');
            done();
        });


    });
    it('should callback with no error and a trimmed string if content.meta.excerpt is valid', function (done) {
        var site = {excerpt_length: 3, render_markdown: default_render_markdown};
        var content = {meta: {__content: '  Good dog ', excerpt: ' Loopy loo    '}, relative_path: 'foo-bar.md'};
        get_excerpt(site, content, null, function(err, result){
            expect(err).to.be.null;
            expect(result).to.equal('Loopy loo');
            done();
        });


    });

    it('should callback with an error and a string of excerpt_length if we pass it a string of content and content.meta.excerpt is an empty string', function (done) {
        var site = {excerpt_length: 3, render_markdown: default_render_markdown};

        var content = {meta: {__content: '  Good dog ', excerpt: '    '}, relative_path: 'foo-bar.md'};
        get_excerpt(site, content, 'Bad bear', function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.equal('Bad');
            done();
        });


    });





});