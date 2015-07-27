/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var is_ignored_conflicts_with_archive = require('../../src/atomic/is_ignored_conflicts_with_archive');


describe('#atomic/is_ignored_conflicts_with_archive()', function() {


    it('should return false for index.md when site = {archives_directory: \'posts\'}', function () {
        var content = {relative_path: 'index.md'};
        var site = {archives_directory: 'posts'};
        expect(is_ignored_conflicts_with_archive(site, content)).to.be.false;

    });

    it('should return true for posts.md when site = {archives_directory: \'posts\'}', function () {
        var content = {relative_path: path.join( 'posts.md')};
        var site = {archives_directory: 'posts'};
        expect(is_ignored_conflicts_with_archive(site, content)).to.be.true;

    });

    it('should return true for posts/index.md when site = {archives_directory: \'posts\'}', function () {
        var content = {relative_path: path.join( 'posts', 'index.md')};
        var site = {archives_directory: 'posts'};
        expect(is_ignored_conflicts_with_archive(site, content)).to.be.true;

    });

    it('should return false for posts/foo.md when site = {archives_directory: \'posts\'}', function () {
        var content = {relative_path: path.join( 'posts', 'foo.md')};
        var site = {archives_directory: 'posts'};
        expect(is_ignored_conflicts_with_archive(site, content)).to.be.false;
    });

    it('should return false for posts/index.md when site = {archives_directory: \'\'}', function () {
        var content = {relative_path: path.join( 'posts', 'index.md')};
        var site = {archives_directory: ''};
        expect(is_ignored_conflicts_with_archive(site, content)).to.be.false;

    });

});