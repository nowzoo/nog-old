/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_template = require('../../src/atomic/get_template');


describe('#atomic/get_template()', function() {



    it('should return "index.twig" for the home page', function () {
        var site = {archives_directory: 'posts', default_template_extension: '.twig'};
        var content = {meta: {}, relative_path: path.join('index.md')};
        expect(get_template(site, content)).to.equal('index.twig');
    });

    it('should return "page.twig" for a page', function () {
        var site = {archives_directory: 'posts', default_template_extension: '.twig'};
        var content = {meta: {}, relative_path: path.join('foo.md')};
        expect(get_template(site, content)).to.equal('page.twig');
    });

    it('should return "post.twig" for a post', function () {
        var site = {archives_directory: 'posts', default_template_extension: '.twig'};
        var content = {meta: {}, relative_path: path.join('posts', 'foo.md')};
        expect(get_template(site, content)).to.equal('post.twig');
    });

    it('should return "custom.twig" for the home page if meta.template is set to custom.twig', function () {
        var site = {archives_directory: 'posts', default_template_extension: '.twig'};
        var content = {meta: {template: 'custom.twig'}, relative_path: path.join('index.md')};
        expect(get_template(site, content)).to.equal('custom.twig');
    });

    it('should return "custom.twig" for a page if meta.template is set to custom.twig', function () {
        var site = {archives_directory: 'posts', default_template_extension: '.twig'};
        var content = {meta: {template: 'custom.twig'}, relative_path: path.join('foo.md')};
        expect(get_template(site, content)).to.equal('custom.twig');
    });

    it('should return "custom.twig" for a post if meta.template is set to custom.twig', function () {
        var site = {archives_directory: 'posts', default_template_extension: '.twig'};
        var content = {meta: {template: 'custom.twig'}, relative_path: path.join('posts', 'foo.md')};
        expect(get_template(site, content)).to.equal('custom.twig');
    });
});


