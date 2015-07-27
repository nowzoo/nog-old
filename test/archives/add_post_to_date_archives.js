/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var moment = require('moment');

var add_post_to_date_archives = require('../../src/archives/add_post_to_date_archives');


describe('#archives/add_post_to_date_archives()', function() {


    it('should create the year archive if it does not yet exist', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var archives = {dates:{}};
        var post = {meta: {date: m.format()}};
        add_post_to_date_archives(site, archives, post);
        expect(archives.dates).to.include.keys('2015');

    });

    it('should add the post to the year archive if the year archive does not yet exist', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var archives = {dates:{}};
        var post = {meta: {date: m.format()}};
        add_post_to_date_archives(site, archives, post);
        expect(archives.dates).to.include.keys('2015');
        expect(archives.dates['2015'].posts[0]).to.equal(post);

    });

    it('should add the post to the year archive if the year archive already exists', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var first_added = {title: 'already added', tags: ['foo']};
        var archives = {dates:{'2015': {posts: [first_added]}}};
        var post = {meta: {date: m.format()}};
        add_post_to_date_archives(site, archives, post);
        expect(archives.dates).to.include.keys('2015');
        expect(archives.dates['2015'].posts[0]).to.equal(first_added);
        expect(archives.dates['2015'].posts[1]).to.equal(post);

    });

    //month...
    it('should create the month archive if it does not yet exist', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var archives = {dates:{}};
        var post = {meta: {date: m.format()}};
        add_post_to_date_archives(site, archives, post);
        expect(archives.dates).to.include.keys('2015/07');

    });

    it('should add the post to the month archive if the month archive does not yet exist', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var archives = {dates:{}};
        var post = {meta: {date: m.format()}};
        add_post_to_date_archives(site, archives, post);
        expect(archives.dates).to.include.keys('2015/07');
        expect(archives.dates['2015/07'].posts[0]).to.equal(post);

    });

    it('should add the post to the month archive if the month archive already exists', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var first_added = {title: 'already added', tags: ['foo']};
        var archives = {dates:{'2015/07': {posts: [first_added]}}};
        var post = {meta: {date: m.format()}};
        add_post_to_date_archives(site, archives, post);
        expect(archives.dates).to.include.keys('2015/07');
        expect(archives.dates['2015/07'].posts[0]).to.equal(first_added);
        expect(archives.dates['2015/07'].posts[1]).to.equal(post);

    });

    //day...
    it('should create the day archive if it does not yet exist', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var archives = {dates:{}};
        var post = {meta: {date: m.format()}};
        add_post_to_date_archives(site, archives, post);
        expect(archives.dates).to.include.keys('2015/07/14');

    });

    it('should add the post to the day archive if the day archive does not yet exist', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var archives = {dates:{}};
        var post = {meta: {date: m.format()}};
        add_post_to_date_archives(site, archives, post);
        expect(archives.dates).to.include.keys('2015/07/14');
        expect(archives.dates['2015/07/14'].posts[0]).to.equal(post);

    });

    it('should add the post to the day archive if the day archive already exists', function () {
        var m = moment('2015/07/14','YYYY/MM/DD');
        var site = {prefix: '', url: 'http://example.com', archives_directory:'posts'};
        var first_added = {title: 'already added', tags: ['foo']};
        var archives = {dates:{'2015/07/14': {posts: [first_added]}}};
        var post = {meta: {date: m.format()}};
        add_post_to_date_archives(site, archives, post);
        expect(archives.dates).to.include.keys('2015/07/14');
        expect(archives.dates['2015/07/14'].posts[0]).to.equal(first_added);
        expect(archives.dates['2015/07/14'].posts[1]).to.equal(post);

    });





});
