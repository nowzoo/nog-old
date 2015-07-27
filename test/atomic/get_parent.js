/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_parent = require('../../src/atomic/get_parent');


describe('#atomic/get_parent()', function() {


    it('should return foo.md for foo/bar.md when foo.md exists', function () {
        var child = {relative_path: path.join( 'foo', 'bar.md')};
        var parent = {relative_path: path.join('foo.md')};
        var contents = {'foo.md': parent, 'foo/bar.md': child};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(get_parent(build, site, child, contents)).to.equal(parent);
    });
    it('should return foo/index.md for foo/bar.md when foo/index.md exists', function () {
        var child = {relative_path: path.join( 'foo', 'bar.md')};
        var parent = {relative_path: path.join('foo', 'index.md')};
        var contents = {'foo/index.md': parent, 'foo/bar.md': child};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(get_parent(build, site, child, contents)).to.equal(parent);
    });

    it('should return foo/index.md for foo/bar.md when both foo.md and foo/index.md exist', function () {
        var child = {relative_path: path.join( 'foo', 'bar.md')};
        var parent = {relative_path: path.join('foo', 'index.md')};
        var ignored = {relative_path: path.join( 'foo.md')};
        var contents = {'foo/index.md': parent, 'foo/bar.md': child, 'foo.md': ignored};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(get_parent(build, site, child, contents)).to.equal(parent);
    });

    it('should return null for foo/bar.md when neither foo.md nor foo/index.md exist', function () {
        var child = {relative_path: path.join( 'foo', 'bar.md')};
        var contents = {'foo/bar.md': child};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(get_parent(build, site, child, contents)).to.be.null;
    });

    it('should return null for foo/bar.md when foo.md exists but is unpublished', function () {
        var child = {relative_path: path.join( 'foo', 'bar.md')};
        var parent = {relative_path: path.join('foo.md'), meta: {published: false}};
        var contents = {'foo.md': parent, 'foo/bar.md': child};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(get_parent(build, site, child, contents)).to.be.null;
    });



    it('should not return the home page for bar.md', function () {
        var child = {relative_path: path.join( 'bar.md')};
        var parent = {relative_path: path.join('index.md')};
        var contents = {'index.md': parent, 'bar.md': child};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(get_parent(build, site, child, contents)).not.to.equal(parent);
    });






});
