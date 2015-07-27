/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_output_path = require('../../src/content/get_output_path');
var get_uri = require('../../src/atomic/get_uri');
var get_main_archives_uri = require('../../src/archives/get_main_archives_uri');
var get_tag_archives_uri = require('../../src/archives/get_tag_archives_uri');


describe('#content/get_output_path()', function() {


    it('should return "index.html" for the atomic content index.md when build.public = true and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts'};
        var build = {public: true};
        var content = {relative_path: path.join('index.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('index.html'));
    });

    it('should return "index.html" for the atomic content index.md when build.public = true and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts'};
        var build = {public: true};
        var content = {relative_path: path.join('index.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('index.html'));
    });

    it('should return "index.html" for the atomic content index.md when build.public = false and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts'};
        var build = {public: false};
        var content = {relative_path: path.join('index.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('index.html'));
    });

    it('should return "foo/index.html" for the atomic content index.md when build.public = false and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts'};
        var build = {public: false};
        var content = {relative_path: path.join('index.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('foo', 'index.html'));
    });


    it('should return "bar/index.html" for the atomic content bar.md when build.public = true and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts'};
        var build = {public: true};
        var content = {relative_path: path.join('bar.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('bar',  'index.html'));
    });

    it('should return "bar/index.html" for the atomic content bar.md when build.public = true and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts'};
        var build = {public: true};
        var content = {relative_path: path.join('bar.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('bar',  'index.html'));
    });

    it('should return "bar/index.html" for the atomic content bar.md when build.public = false and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts'};
        var build = {public: false};
        var content = {relative_path: path.join('bar.md')};
        var uri = get_uri(site, content);;
        expect(get_output_path(site, build, uri)).to.equal(path.join('bar',  'index.html'));
    });
    it('should return "foo/bar/index.html" for the atomic content bar.md when build.public = false and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts'};
        var build = {public: false};
        var content = {relative_path: path.join('bar.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('foo', 'bar',  'index.html'));
    });


    it('should return "bar/index.html" for the atomic content bar/index.md when build.public = true and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts'};
        var build = {public: true};
        var content = {relative_path: path.join('bar', 'index.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('bar',  'index.html'));
    });

    it('should return "bar/index.html" for the atomic content bar/index.md when build.public = true and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts'};
        var build = {public: true};
        var content = {relative_path: path.join('bar', 'index.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('bar',  'index.html'));
    });

    it('should return "bar/index.html" for the atomic content bar/index.md when build.public = false and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts'};
        var build = {public: false};
        var content = {relative_path: path.join('bar', 'index.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('bar',  'index.html'));
    });
    it('should return "foo/bar/index.html" for the atomic content bar/index.md when build.public = false and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts'};
        var build = {public: false};
        var content = {relative_path: path.join('bar', 'index.md')};
        var uri = get_uri(site, content);
        expect(get_output_path(site, build, uri)).to.equal(path.join('foo', 'bar',  'index.html'));
    });


    it('should return "posts/index.html" for the main post archives when build.public = true and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts'};
        var build = {public: true};
        var uri = get_main_archives_uri(site);
        expect(get_output_path(site, build, uri)).to.equal(path.join('posts',  'index.html'));
    });

    it('should return "posts/index.html" for the main post archives when build.public = true and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts'};
        var build = {public: true};
        var uri = get_main_archives_uri(site);
        expect(get_output_path(site, build, uri)).to.equal(path.join('posts',  'index.html'));
    });

    it('should return "posts/index.html" for the main post archives when build.public = false and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts'};
        var build = {public: false};
        var uri = get_main_archives_uri(site);
        expect(get_output_path(site, build, uri)).to.equal(path.join('posts',  'index.html'));
    });

    it('should return "foo/posts/index.html" for the main post archives when build.public = false and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts'};
        var build = {public: false};
        var uri = get_main_archives_uri(site);
        expect(get_output_path(site, build, uri)).to.equal(path.join('foo', 'posts',  'index.html'));
    });

    it('should return "posts/p/2/index.html" for the second page of the main post archives when build.public = true and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_page_slug: 'p'};
        var build = {public: true};
        var uri = get_main_archives_uri(site, 1);
        expect(get_output_path(site, build, uri)).to.equal(path.join( 'posts', 'p', '2',  'index.html'));
    });
    it('should return "posts/p/2/index.html" for the second page of the main post archives when build.public = true and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts', archives_page_slug: 'p'};
        var build = {public: true};
        var uri = get_main_archives_uri(site, 1);
        expect(get_output_path(site, build, uri)).to.equal(path.join('posts', 'p', '2',  'index.html'));
    });
    it('should return "posts/p/2/index.html" for the second page of the main post archives when build.public = false and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_page_slug: 'p'};
        var build = {public: false};
        var uri = get_main_archives_uri(site, 1);
        expect(get_output_path(site, build, uri)).to.equal(path.join( 'posts', 'p', '2',  'index.html'));
    });

    it('should return "foo/posts/p/2/index.html" for the second page of the main post archives when build.public = false and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts', archives_page_slug: 'p'};
        var build = {public: false};
        var uri = get_main_archives_uri(site, 1);
        expect(get_output_path(site, build, uri)).to.equal(path.join('foo', 'posts', 'p', '2',  'index.html'));
    });

    it('should return "posts/tagged/foo-bar/p/2/index.html" for the second page of a tag archive when build.public = true and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_page_slug: 'p', archives_tag_slug: 'tagged'};
        var build = {public: true};
        var uri = get_tag_archives_uri(site, 'foo-bar', 1);
        expect(get_output_path(site, build, uri)).to.equal(path.join('posts', 'tagged', 'foo-bar', 'p', '2',  'index.html'));
    });

    it('should return "posts/tagged/foo-bar/p/2/index.html" for the second page of a tag archive when build.public = true and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts', archives_page_slug: 'p', archives_tag_slug: 'tagged'};
        var build = {public: true};
        var uri = get_tag_archives_uri(site, 'foo-bar', 1);
        expect(get_output_path(site, build, uri)).to.equal(path.join('posts', 'tagged', 'foo-bar', 'p', '2',  'index.html'));
    });


    it('should return "posts/tagged/foo-bar/p/2/index.html" for the second page of a tag archive when build.public = false and site.prefix=""', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_page_slug: 'p', archives_tag_slug: 'tagged'};
        var build = {public: false};
        var uri = get_tag_archives_uri(site, 'foo-bar', 1);
        expect(get_output_path(site, build, uri)).to.equal(path.join('posts', 'tagged', 'foo-bar', 'p', '2',  'index.html'));
    });

    it('should return "foo/posts/tagged/foo-bar/p/2/index.html" for the second page of a tag archive when build.public = false and site.prefix="foo"', function () {
        var site = {prefix:'foo', archives_directory: 'posts', archives_page_slug: 'p', archives_tag_slug: 'tagged'};
        var build = {public: false};
        var uri = get_tag_archives_uri(site, 'foo-bar', 1);
        expect(get_output_path(site, build, uri)).to.equal(path.join('foo', 'posts', 'tagged', 'foo-bar', 'p', '2',  'index.html'));
    });



});


