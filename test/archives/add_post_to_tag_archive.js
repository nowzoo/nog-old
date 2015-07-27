/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var moment = require('moment');

var add_post_to_tag_archive = require('../../src/archives/add_post_to_tag_archive');


describe('#archives/add_post_to_tag_archive()', function() {


    it('should create the tag archive if it does not yet exist', function () {
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var archives = {tags:{}};
        var post = {tags: ['foo']};
        add_post_to_tag_archive(site, archives, post, 'foo');
        expect(archives.tags).to.include.keys('foo');

    });
    it('should add the post to the tag archive if the archive does not yet exist', function () {
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var archives = {tags:{}};
        var post = {tags: ['foo']};
        add_post_to_tag_archive(site, archives, post, 'foo');
        expect(archives.tags.foo.posts[0]).to.equal(post);

    });

    it('should add the post to the tag archive if the archive already exists', function () {
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var first_added = {title: 'already added', tags: ['foo']}
        var archives = {tags:{foo: {posts: [first_added]}}};
        var post = {title: 'not yet added', tags: ['foo']};
        add_post_to_tag_archive(site, archives, post, 'foo');
        expect(archives.tags.foo.posts[0]).to.equal(first_added);
        expect(archives.tags.foo.posts[1]).to.equal(post);

    });
    it('should correctly slugify the tag archive if it does not yet exist', function () {
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var archives = {tags:{}};
        var post = {tags: ['Foo Bar']};
        add_post_to_tag_archive(site, archives, post, 'Foo Bar');
        expect(archives.tags).to.include.keys('foo-bar');

    });



});
