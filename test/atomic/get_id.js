/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_id = require('../../src/atomic/get_id');


describe('#atomic/get_id()', function() {


    it('should return "" for index.md', function () {
        var content = {relative_path: 'index.md'};
        expect(get_id(content)).to.equal('');
    });



    it('should return "bar" for bar.md', function () {
        var content = {relative_path: path.join( 'bar.md')};
        expect(get_id(content)).to.equal('bar');
    });



    it('should return "bar" for bar/index.md', function () {
        var content = {relative_path: path.join( 'bar', 'index.md')};
        expect(get_id(content)).to.equal('bar');
    });

});


