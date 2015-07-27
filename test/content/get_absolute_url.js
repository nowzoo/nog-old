/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var atomic_get_uri = require('../../src/atomic/get_uri');
var get_absolute_url = require('../../src/content/get_absolute_url');


describe('#content/get_absolute_url()', function() {


    it('should return "http://example.com/" for the atomic content at index.md when site.prefix=""', function () {
        var site = {prefix:'', url: 'http://example.com'};
        var content = {relative_path: 'index.md'};
        var uri = atomic_get_uri(site, content);
        expect(get_absolute_url(site, uri)).to.equal('http://example.com/');
    });

    it('should return "http://example.com/foo/" for the atomic content at index.md when site.prefix="foo"', function () {
        var site = {prefix:'foo', url: 'http://example.com'};
        var content = {relative_path: 'index.md'};
        var uri = atomic_get_uri(site, content);
        expect(get_absolute_url(site, uri)).to.equal('http://example.com/foo/');
    });

    it('should return "http://example.com/bar/" for the atomic content at bar.md when site.prefix=""', function () {
        var site = {prefix:'', url: 'http://example.com'};
        var content = {relative_path: 'bar.md'};
        var uri = atomic_get_uri(site, content);
        expect(get_absolute_url(site, uri)).to.equal('http://example.com/bar/');
    });

    it('should return "http://example.com/foo/bar/" for the atomic content at bar.md when site.prefix="foo"', function () {
        var site = {prefix:'foo', url: 'http://example.com'};
        var content = {relative_path: 'bar.md'};
        var uri = atomic_get_uri(site, content);
        expect(get_absolute_url(site, uri)).to.equal('http://example.com/foo/bar/');
    });


    it('should return "http://example.com/bar/" for the atomic content at bar/index.md when site.prefix=""', function () {
        var site = {prefix:'', url: 'http://example.com'};
        var content = {relative_path: path.join('bar', 'index.md')};
        var uri = atomic_get_uri(site, content);
        expect(get_absolute_url(site, uri)).to.equal('http://example.com/bar/');
    });

    it('should return "http://example.com/foo/bar/" for the atomic content at bar/index.md when site.prefix="foo"', function () {
        var site = {prefix:'foo', url: 'http://example.com'};
        var content = {relative_path: path.join('bar', 'index.md')};
        var uri = atomic_get_uri(site, content);
        expect(get_absolute_url(site, uri)).to.equal('http://example.com/foo/bar/');
    });

    
});


