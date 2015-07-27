/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var atomic_get_uri = require('../../src/atomic/get_uri');
var get_relative_url = require('../../src/content/get_relative_url');


describe('#content/get_relative_url()', function() {


    it('should return "/" for the atomic content at index.md when site.prefix=""', function () {
        var site = {prefix:'', url: 'http://example.com'};
        var content = {relative_path: 'index.md'};
        var uri = atomic_get_uri(site, content);
        expect(get_relative_url(uri)).to.equal('/');
    });

    it('should return "/foo/" for the atomic content at index.md when site.prefix="foo"', function () {
        var site = {prefix:'foo', url: 'http://example.com'};
        var content = {relative_path: 'index.md'};
        var uri = atomic_get_uri(site, content);
        expect(get_relative_url(uri)).to.equal('/foo/');
    });

    it('should return "/bar/" for the atomic content at bar.md when site.prefix=""', function () {
        var site = {prefix:'', url: 'http://example.com'};
        var content = {relative_path: 'bar.md'};
        var uri = atomic_get_uri(site, content);
        expect(get_relative_url(uri)).to.equal('/bar/');
    });

    it('should return "/foo/bar/" for the atomic content at bar.md when site.prefix="foo"', function () {
        var site = {prefix:'foo', url: 'http://example.com'};
        var content = {relative_path: 'bar.md'};
        var uri = atomic_get_uri(site, content);
        expect(get_relative_url(uri)).to.equal('/foo/bar/');
    });


    it('should return "/bar/" for the atomic content at bar/index.md when site.prefix=""', function () {
        var site = {prefix:'', url: 'http://example.com'};
        var content = {relative_path: path.join('bar', 'index.md')};
        var uri = atomic_get_uri(site, content);
        expect(get_relative_url(uri)).to.equal('/bar/');
    });

    it('should return "/foo/bar/" for the atomic content at bar/index.md when site.prefix="foo"', function () {
        var site = {prefix:'foo', url: 'http://example.com'};
        var content = {relative_path: path.join('bar', 'index.md')};
        var uri = atomic_get_uri(site, content);
        expect(get_relative_url(uri)).to.equal('/foo/bar/');
    });

    
});


