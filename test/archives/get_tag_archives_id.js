/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_tag_archives_id = require('../../src/archives/get_tag_archives_id');


describe('#archives/get_tag_archives_id()', function() {


    it('should return "posts/tagged/foo-bar" for a tag with the slug foo-bar, when site.prefix is empty', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var tag_slug = 'foo-bar';
        expect(get_tag_archives_id(site, tag_slug)).to.equal('posts/tagged/foo-bar');
    });
    it('should return "posts/tagged/foo-bar" for a tag with the slug foo-bar, when site.prefix is not empty', function () {
        var site = {prefix:'foo', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var tag_slug = 'foo-bar';
        expect(get_tag_archives_id(site, tag_slug)).to.equal('posts/tagged/foo-bar');
    });



});


