/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_prefixed_uri = require('../../src/content/get_prefixed_uri');


describe('#content/get_prefixed_uri()', function() {


    it('should return "posts" for a base_uri = "posts" and site.prefix = ""', function () {
        var site = {prefix:''};
        var base_uri = 'posts';
        expect(get_prefixed_uri(site, base_uri)).to.equal('posts');
    });

    it('should return "foo/posts" for a base_uri = "posts" and site.prefix = "foo"', function () {
        var site = {prefix:'foo', archives_page_slug: 'p'};
        var base_uri = 'posts';
        expect(get_prefixed_uri(site, base_uri)).to.equal('foo/posts');
    });

    it('should return "" for a base_uri = "" and site.prefix = ""', function () {
        var site = {prefix:''};
        var base_uri = '';
        expect(get_prefixed_uri(site, base_uri)).to.equal('');
    });

    it('should return "foo" for a base_uri = "" and site.prefix = "foo"', function () {
        var site = {prefix:''};
        var base_uri = 'foo';
        expect(get_prefixed_uri(site, base_uri)).to.equal('foo');
    });



});


