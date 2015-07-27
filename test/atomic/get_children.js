/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_children = require('../../src/atomic/get_children');


describe('#atomic/get_children()', function() {


    it('should return an array containing foo/bar.md for foo.md when foo/bar.md exists', function () {
        var child = {relative_path: path.join( 'foo', 'bar.md')};
        var parent = {relative_path: path.join('foo.md')};
        var contents = {'foo.md': parent, 'foo/bar.md': child};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        var children = get_children(build, site, parent, contents);
        expect(children).to.be.an('array');
        expect(children).to.have.length(1);
        expect(children).to.contain(child);
    });
    it('should return an array containing foo/bar.md for foo/index.md when foo/bar.md exists', function () {
        var child = {relative_path: path.join( 'foo', 'bar.md')};
        var parent = {relative_path: path.join('foo', 'index.md')};
        var contents = {'foo/index.md': parent, 'foo/bar.md': child};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        var children = get_children(build, site, parent, contents);
        expect(children).to.be.an('array');
        expect(children).to.have.length(1);
        expect(children).to.contain(child);
    });
    it('should return an array not containing foo/bar.md for foo/index.md when foo/bar.md exists but is unpublished', function () {
        var child = {relative_path: path.join( 'foo', 'bar.md'), meta: {published: false}};
        var parent = {relative_path: path.join('foo', 'index.md')};
        var contents = {'foo/index.md': parent, 'foo/bar.md': child};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        var children = get_children(build, site, parent, contents);
        expect(children).to.be.an('array');
        expect(children).to.have.length(0);
        expect(children).not.to.contain(child);
    });
    it('should return an array not containing foo/bar.css for foo/index.md when foo/bar.css exists', function () {
        var child = {relative_path: path.join( 'foo', 'bar.css'), meta: {published: false}};
        var parent = {relative_path: path.join('foo', 'index.md')};
        var contents = {'foo/index.md': parent, 'foo/bar.css': child};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        var children = get_children(build, site, parent, contents);
        expect(children).to.be.an('array');
        expect(children).to.have.length(0);
        expect(children).not.to.contain(child);
    });







});
