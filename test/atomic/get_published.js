/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;

var get_published = require('../../src/atomic/get_published');


describe('#atomic/get_published()', function() {


    it('should return true if content.meta.published does not exist', function () {
        var build = {public: true, published_only: true};
        var content = {meta: {}};
        expect(get_published(build, content)).to.be.true;


    });

    it('should return true if content.meta.published is not a bool', function () {
        var build = {public: true, published_only: true};
        var content = {meta: {published: /fff/}};
        expect(get_published(build, content)).to.be.true;


    });

    it('should return true if content.meta.published is true', function () {
        var val;
        var build = {public: true, published_only: true};
        var content = {meta: {published: true}};
        expect(get_published(build, content)).to.be.true;

    });

    it('should return false if content.meta.published is false', function () {
        var build = {public: true, published_only: true};
        var content = {meta: {published: false}, lint: {}};
        expect(get_published(build, content)).to.be.false;


    });

    it('should return true if content.meta.published is false but build = {public: false, published_only: false}', function () {
        var build = {public: false, published_only: false};
        var content = {meta: {published: false}, lint: {}};
        expect(get_published(build, content)).to.be.true;

    });


    it('should return false if content.meta.published is false but build = {public: false, published_only: true}', function () {
        var build = {public: false, published_only: true};
        var content = {meta: {published: false}, lint: {}};
        expect(get_published(build, content)).to.be.false;
    });
});


