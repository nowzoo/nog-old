/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_paged_uri = require('../../src/content/get_paged_uri');


describe('#content/get_paged_uri()', function() {


    it('should return "posts" for a base_uri = "posts" and page = 0', function () {
        var site = {prefix:'', archives_page_slug: 'p'};
        var page = 0;
        var base_uri = 'posts';
        expect(get_paged_uri(site, base_uri, page)).to.equal('posts');
    });

    it('should return "posts/p/2" for a base_uri = "posts" and page = 1', function () {
        var site = {prefix:'', archives_page_slug: 'p'};
        var page = 1;
        var base_uri = 'posts';
        expect(get_paged_uri(site, base_uri, page)).to.equal('posts/p/2');
    });



});


