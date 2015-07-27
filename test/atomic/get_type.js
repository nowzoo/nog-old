/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_type = require('../../src/atomic/get_type');


describe('#atomic/get_type()', function() {


    it('should return "index" for index.md', function () {
        var content = {relative_path: path.join('index.md')};
        var site = {archives_directory: 'posts'};
        expect(get_type(site, content)).to.equal('index');
    });

    it('should return "index" for index.html', function () {
        var content = {relative_path: path.join('index.html')};
        var site = {archives_directory: 'posts'};
        expect(get_type(site, content)).to.equal('index');
    });
    it('should return "page" for foo.html', function () {
        var content = {relative_path: path.join('foo.html')};
        var site = {archives_directory: 'posts'};
        expect(get_type(site, content)).to.equal('page');
    });
    it('should return "page" for foo/index.html', function () {
        var content = {relative_path: path.join('foo', 'index.html')};
        var site = {archives_directory: 'posts'};
        expect(get_type(site, content)).to.equal('page');

    });
    it('should return "post" for posts/my-first-post.html when archives_directory=posts', function () {
        var content = {relative_path: path.join('posts', 'my-first-post.html')};
        var site = {archives_directory: 'posts'};
        expect(get_type(site, content)).to.equal('post');

    });
    it('should return "page" for posts/my-first-post.html when archives_directory != posts', function () {
        var content = {relative_path: path.join('posts', 'my-first-post.html')};
        var site = {archives_directory: 'updates'};
        expect(get_type(site, content)).to.equal('page');

    });
    it('should return "page" for posts/my-first-post.html when archives_directory is empty', function () {
        var content = {relative_path: path.join('posts', 'my-first-post.html')};
        var site = {archives_directory: ''};
        expect(get_type(site, content)).to.equal('page');

    });
});


