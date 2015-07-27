/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var moment = require('moment');

var create = require('../../src/archives/create');


describe('#archives/create()', function() {


    it('should return an object', function () {
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var contents = {};
        var archives = create(site, contents);
        expect(archives).to.be.an('object')

    });

    it('should add posts to the main and date archives', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var contents = {
            'posts/my-first-post.md': {
                meta: {date: m.format()},
                ignored: false,
                published: true,
                type: 'post'
            }
        };
        var archives = create(site, contents);
        expect(archives).to.be.an('object');
        expect(archives.main.posts).to.have.length(1);
        expect(archives.dates['2015'].posts).to.have.length(1);
        expect(archives.dates['2015/07'].posts).to.have.length(1);
        expect(archives.dates['2015/07/14'].posts).to.have.length(1);

    });

    it('should add posts to tag archives', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var contents = {
            'posts/my-first-post.md': {
                meta: {date: m.format()},
                ignored: false,
                published: true,
                type: 'post',
                tags: ['Foo', 'Bar']
            }
        };
        var archives = create(site, contents);
        expect(archives).to.be.an('object');
        expect(archives.main.posts).to.have.length(1);
        expect(archives.tags.foo.posts).to.have.length(1);
        expect(archives.tags.bar.posts).to.have.length(1);


    });




});
