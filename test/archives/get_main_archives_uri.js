/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var moment = require('moment');

var get_main_archives_uri = require('../../src/archives/get_main_archives_uri');


describe('#archives/get_main_archives_uri()', function() {


    it('should return "posts", not being passed a page', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        expect(get_main_archives_uri(site)).to.equal('posts');
    });

    it('should return "posts" being passed a page = 0', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        expect(get_main_archives_uri(site,0)).to.equal('posts');
    });
    it('should return "posts/p/2" being passed a page = 1', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        expect(get_main_archives_uri(site, 1)).to.equal('posts/p/2');
    });



});


