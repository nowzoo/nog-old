/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_basename = require('../../src/atomic/get_basename');


describe('#atomic/get_basename()', function() {


    it('should return "index" for index.md', function () {
        var content = {relative_path: 'index.md'};
        expect(get_basename(content)).to.equal('index');

    });
    it('should return "index" for index.html', function () {
        var content = {relative_path: 'index.html'};
        expect(get_basename(content)).to.equal('index');

    });
    it('should return "bar" for foo/bar.html', function () {
        var content = {relative_path: path.join( 'foo', 'bar.html')};
        expect(get_basename(content)).to.equal('bar');
    });
});


