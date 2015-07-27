/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var is_ignored_overridden_by_sibling = require('../../src/atomic/is_ignored_overridden_by_sibling');
var get_published = require('../../src/atomic/get_published');


describe('#atomic/is_ignored_overridden_by_sibling()', function() {


    it('should return true for foo.html when foo.md exists and .md comes first in content_extensions', function () {
        var overridden = {relative_path: path.join( 'foo.html')};
        var overriding = {relative_path: path.join(  'foo.md')};
        var contents = {'foo.md': overridden, 'foo/index.md': overriding};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored_overridden_by_sibling(build, site, overridden, contents)).to.be.true;
    });

    it('should return false for foo.md when foo.html exists and .md comes first in content_extensions', function () {
        var overridden = {relative_path: path.join( 'foo.html')};
        var overriding = {relative_path: path.join(  'foo.md')};
        var contents = {'foo.md': overridden, 'foo/index.md': overriding};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(is_ignored_overridden_by_sibling(build, site, overriding, contents)).to.be.false;

    });

    it('should return false for foo.html when foo.md is not published', function () {
        var overridden = {relative_path: path.join( 'foo.html')};
        var overriding = {relative_path: path.join(  'foo.md'), meta:{published: false}};
        var contents = {'foo.md': overridden, 'foo/index.md': overriding};
        var site = {content_extensions: ['.md', '.html'], archives_directory: 'posts'};
        var build = {public: true, published_only: true};
        expect(get_published(build, overriding)).to.be.false;
        expect(is_ignored_overridden_by_sibling(build, site, overridden, contents)).to.be.false;

    });



});
