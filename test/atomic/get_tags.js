/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var moment = require('moment');

var get_tags = require('../../src/atomic/get_tags');


describe('#atomic/get_tags()', function() {


    it('should return an array of length 0 if content.meta.tags is missing', function () {
        var content = {meta: {}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.have.length(0);
    });

    it('should return an array of length 0 if content.meta.tags is other than an array or string', function () {
        var content = {meta: {tags: /ff/}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.have.length(0);

    });
    it('should return an array of length 0 if content.meta.tags is an empty array', function () {
        var content = {meta: {tags: []}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.have.length(0);
    });
    it('should return an array of length 0 if content.meta.tags is an empty string', function () {
        var content = {meta: {tags: '    '}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.have.length(0);

    });

    it('should return an array with tags content.meta.tags is a string', function () {
        var content = {meta: {tags: 'foo, bar'}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.deep.equal(['foo', 'bar']);
    });

    it('should return an array with tags content.meta.tags is an array', function () {
        var content = {meta: {tags: ['foo', 'bar']}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.deep.equal(['foo', 'bar']);

    });
    it('should remove duplicates', function () {
        var content = {meta: {tags: ['foo', 'bar', 'foo']}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.deep.equal(['foo', 'bar']);

    });

    it('should remove duplicates in a case-insensitive manner', function () {
        var content = {meta: {tags: ['foo', 'bar', 'FOO']}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.deep.equal(['foo', 'bar']);
    });
    it('should trim the tags', function () {
        var content = {meta: {tags: ['   foo', 'bar    ']}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.deep.equal(['foo', 'bar']);


    });
    it('should deal with multi-word tags', function () {
        var content = {meta: {tags: ['Banana Boat', 'medical Doctor']}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.deep.equal(['Banana Boat', 'medical Doctor']);
       
    });

    it('should remove things that are not strings', function () {
        var content = {meta: {tags: ['foo', 'bar', /ff/, [], {}]}};
        var val = get_tags(content);
        expect(val).to.be.an('array');
        expect(val).to.deep.equal(['foo', 'bar']);

    });


});