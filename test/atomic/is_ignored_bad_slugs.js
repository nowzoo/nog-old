/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var is_ignored_bad_slugs = require('../../src/atomic/is_ignored_bad_slugs');


describe('#atomic/is_ignored_bad_slugs()', function() {


    it('should return false for index.md', function () {
        var content = {relative_path: 'index.md'};
        expect(is_ignored_bad_slugs(content)).to.be.false;
    });

    it('should return false for bar.md', function () {
        var content = {relative_path: path.join( 'bar.md')};
        expect(is_ignored_bad_slugs(content)).to.be.false;
    });
    it('should return false for foo/bar.md', function () {
        var content = {relative_path: path.join('foo', 'bar.md')};
        expect(is_ignored_bad_slugs(content)).to.be.false;
    });

    it('should return true for FOO/bar.md', function () {
        var content = {relative_path: path.join('FOO', 'bar.md')};
        expect(is_ignored_bad_slugs(content)).to.be.true;

    });

    it('should return true for -foo/bar.md', function () {
        var content = {relative_path: path.join('-foo', 'bar.md')};
        expect(is_ignored_bad_slugs(content)).to.be.true;

    });
    it('should return true for foo bar/bar.md', function () {
        var content = {relative_path: path.join('foo bar', 'bar.md')};
        expect(is_ignored_bad_slugs(content)).to.be.true;

    });
    it('should return true for bar/foo bar.md', function () {
        var content = {relative_path: path.join('bar', 'foo bar.md')};
        expect(is_ignored_bad_slugs(content)).to.be.true;

    });
    it('should return true for bar/foo_bar.md', function () {
        var content = {relative_path: path.join('bar', 'foo_bar.md')};
        expect(is_ignored_bad_slugs(content)).to.be.true;

    });
});