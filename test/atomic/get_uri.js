/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_uri = require('../../src/atomic/get_uri');


describe('#atomic/get_uri()', function() {


    it('should return "" for index.md when site.prefix=""', function () {
        var site = {prefix:''};
        var content = {relative_path: 'index.md'};
        expect(get_uri(site, content)).to.equal('');
    });

    it('should return "foo" for index.md when site.prefix="foo"', function () {
        var site = {prefix: 'foo'};
        var content = {relative_path: 'index.md'};
        expect(get_uri(site, content)).to.equal('foo');
    });

    it('should return "bar" for bar.md when site.prefix=""', function () {
        var site = {prefix:''};
        var content = {relative_path: 'bar.md'};
        expect(get_uri(site, content)).to.equal('bar');
    });

    it('should return "foo/bar" for bar.md when site.prefix="foo"', function () {
        var site = {prefix: 'foo'};
        var content = {relative_path: 'bar.md'};
        expect(get_uri(site, content)).to.equal('foo/bar');
    });


    it('should return "bar" for bar/index.md when site.prefix=""', function () {
        var site = {prefix:''};
        var content = {relative_path: path.join('bar', 'index.md')};
        expect(get_uri(site, content)).to.equal('bar');
    });

    it('should return "foo/bar" for bar/index.md when site.prefix="foo"', function () {
        var site = {prefix: 'foo'};
        var content = {relative_path: path.join('bar', 'index.md')};
        expect(get_uri(site, content)).to.equal('foo/bar');
    });

    it('should return "baz/bar" for baz/bar.md when site.prefix=""', function () {
        var site = {prefix:''};
        var content = {relative_path: path.join('baz', 'bar.md')};
        expect(get_uri(site, content)).to.equal('baz/bar');
    });

    it('should return "foo/baz/bar" for baz/bar.md when site.prefix="foo"', function () {
        var site = {prefix:'foo'};
        var content = {relative_path: path.join('baz', 'bar.md')};
        expect(get_uri(site, content)).to.equal('foo/baz/bar');
    });
});


