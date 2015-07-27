/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var is_ignored_extension = require('../../src/atomic/is_ignored_extension');


describe('#atomic/is_ignored_extension()', function() {


    it('should return false for index.md', function () {
        var content = {relative_path: 'index.md'};
        var site = {content_extensions: ['.md', '.html']};
        expect(is_ignored_extension(site, content)).to.be.false;
    });

    it('should return false for for index.markdown if .markdown is in site.content_extensions', function () {
        var content = {relative_path: 'index.md'};
        var site = {content_extensions: ['.md', '.html', '.markdown']};
        expect(is_ignored_extension(site, content)).to.be.false;

    });

    it('should return true for index.css', function () {
        var content = {relative_path: 'index.css'};
        var site = {content_extensions: ['.md', '.html']};
        expect(is_ignored_extension(site, content)).to.be.true;

    });



});