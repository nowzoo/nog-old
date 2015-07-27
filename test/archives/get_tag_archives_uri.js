/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_tag_archives_uri = require('../../src/archives/get_tag_archives_uri');


describe('#archives/get_tag_archives_uri()', function() {


    it('should return "posts/tagged/foo-bar" for a tag with the slug foo-bar, not being passed a page', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var tag_slug = 'foo-bar';
        expect(get_tag_archives_uri(site, tag_slug)).to.equal('posts/tagged/foo-bar');
    });
    it('should return "posts/tagged/foo-bar" for a tag with the slug foo-bar, with page = 0', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var tag_slug = 'foo-bar';
        var page = 0;
        expect(get_tag_archives_uri(site, tag_slug, page)).to.equal('posts/tagged/foo-bar');
    });
    it('should return "posts/tagged/foo-bar/p/2" for a tag with the slug foo-bar, with page = 1', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var tag_slug = 'foo-bar';
        var page = 1;
        expect(get_tag_archives_uri(site, tag_slug, page)).to.equal('posts/tagged/foo-bar/p/2');
    });

    it('should return "foo/posts/tagged/foo-bar/p/2" for a tag with the slug foo-bar, with page = 1 when site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var tag_slug = 'foo-bar';
        var page = 1;
        expect(get_tag_archives_uri(site, tag_slug, page)).to.equal('foo/posts/tagged/foo-bar/p/2');
    });


});


