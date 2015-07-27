/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var is_ignored_overridden_by_index = require('../../src/atomic/is_ignored_overridden_by_index');


describe('#atomic/is_ignored_overridden_by_index()', function() {


    it('should return true for foo.md when foo/index.md exists', function () {
        var overridden = {relative_path: path.join( 'foo.md')};
        var overriding = {relative_path: path.join( 'foo', 'index.md')};
        var contents = {'foo.md': overridden, 'foo/index.md': overriding};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored_overridden_by_index(build, site, overridden, contents)).to.be.true;
    });

    it('should return false for foo.md when foo/index.css exists (bad ext)', function () {
        var overridden = {relative_path: path.join( 'foo.md')};
        var overriding = {relative_path: path.join( 'foo', 'index.css')};
        var contents = {'foo.md': overridden, 'foo/index.css': overriding};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored_overridden_by_index(build, site, overridden, contents)).to.be.false;

    });

    it('should return false for foo.md when foo/index.md exists but isn\'t published', function () {
        var overridden = {relative_path: path.join( 'foo.md')};
        var overriding = {relative_path: path.join( 'foo', 'index.md'), meta:{published: false}};
        var contents = {'foo.md': overridden, 'foo/index.md': overriding};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored_overridden_by_index(build, site, overridden, contents)).to.be.false;

    });

    it('should return false for foo.md when foo/index.md doesn\'t exist', function () {
        var overridden = {relative_path: path.join( 'foo.md')};
        var contents = {'foo.md': overridden};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored_overridden_by_index(build, site, overridden, contents)).to.be.false;

    });


});
