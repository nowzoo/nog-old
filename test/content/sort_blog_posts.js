/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var _ = require('lodash');

var sort_blog_posts = require('../../src/content/sort_blog_posts');



describe('#content/sort_blog_posts()', function () {



    it('should order posts by date desc', function () {
        var test = {
            'third-post': {meta: {title: 'Foo', date: '2015/07/25 11:30 AM'}},
            'first-post': {meta: {title: 'Foo', date: '2015/07/25 9:30 AM'}},
            'second-post': {meta: {title: 'Foo', date: '2015/07/25 10:30 AM'}}
        };
        var posts = _.values(test);
        sort_blog_posts(posts);

        expect(posts[0]).to.equal(test['third-post']);
        expect(posts[1]).to.equal(test['second-post']);
        expect(posts[2]).to.equal(test['first-post']);
    });

    it('should order posts of equal date by title asc', function () {
        var test = {
            'third-post': {meta: {title: 'Zafad', date: '2015/07/25 11:30 AM'}},
            'first-post': {meta: {title: 'Abc', date: '2015/07/25 11:30 AM'}},
            'second-post': {meta: {title: 'MMMM', date: '2015/07/25 11:30 AM'}}
        };
        var posts = _.values(test);
        sort_blog_posts(posts);

        expect(posts[0]).to.equal(test['first-post']);
        expect(posts[1]).to.equal(test['second-post']);
        expect(posts[2]).to.equal(test['third-post']);
    });
    it('should leave the order of posts of equal date and title', function () {
        var test = {
            'first-post': {meta: {title: 'Abc', date: '2015/07/25 11:30 AM'}},
            'second-post': {meta: {title: 'Abc', date: '2015/07/25 11:30 AM'}}
        };
        var posts = _.values(test);
        sort_blog_posts(posts);

        expect(posts[0]).to.equal(test['first-post']);
        expect(posts[1]).to.equal(test['second-post']);
    });



});

