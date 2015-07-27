/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var is_ignored = require('../../src/atomic/is_ignored');


describe('#atomic/is_ignored()', function() {


    it('should return false for index.md', function () {
        var content = {relative_path: 'index.md'};
        var contents = {'index.md': content};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored(build, site, content, contents)).to.be.false;
    });

    it('should return true for a bad slug', function () {
        var content = {relative_path: 'foo_bar.md'};
        var contents = {'foo_bar.md': content};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored(build, site, content, contents)).to.be.true;

    });

    it('should return true for an ignored extension', function () {
        var content = {relative_path: 'index.css'};
        var contents = {'index.css': content};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored(build, site, content, contents)).to.be.true;

    });

    it('should return true for content that conflicts with the archives', function () {
        var content = {relative_path: path.join('posts', 'index.md')};
        var contents = {'posts/index.md': content};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored(build, site, content, contents)).to.be.true;

    });

    it('should return true for foo.html when foo.md exists and .md comes first in content_extensions', function () {
        var overridden = {relative_path: path.join( 'foo.html')};
        var overriding = {relative_path: path.join(  'foo.md')};
        var contents = {'foo.md': overridden, 'foo/index.md': overriding};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored(build, site, overridden, contents)).to.be.true;

    });

    it('should return true for for foo.md when foo/index.md exists', function () {
        var overridden = {relative_path: path.join( 'foo.md')};
        var overriding = {relative_path: path.join( 'foo', 'index.md')};
        var contents = {'foo.md': overridden, 'foo/index.md': overriding};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored(build, site, overridden, contents)).to.be.true;

    });

});