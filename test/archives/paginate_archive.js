/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var moment = require('moment');

var paginate_archive = require('../../src/archives/paginate_archive');


describe('#archives/paginate_archive()', function() {


    it('should set the archive\'s post count correctly when it is 3', function () {
        var site = {
            prefix: '',
            url: 'http://example.com',
            archives_directory:'posts',
            archives_posts_per_page: 10
        };

        var archive = {
            uri: 'posts/tagged/foo',
            posts: [1, 2, 3]
        };
        paginate_archive(site, archive);
        expect(archive.post_count).to.equal(3)

    });

    it('should set the archive\'s post count correctly when it is 0', function () {
        var site = {
            prefix: '',
            url: 'http://example.com',
            archives_directory:'posts',
            archives_posts_per_page: 10
        };

        var archive = {
            uri: 'posts/tagged/foo',
            posts: []
        };
        paginate_archive(site, archive);
        expect(archive.post_count).to.equal(0)

    });
    it('should set the archive\'s page count correctly when post_count = 3 and posts_per_page=10', function () {
        var site = {
            prefix: '',
            url: 'http://example.com',
            archives_directory:'posts',
            archives_posts_per_page: 10
        };

        var archive = {
            uri: 'posts/tagged/foo',
            posts: [1, 2, 3]
        };
        paginate_archive(site, archive);
        expect(archive.page_count).to.equal(1);

    });
    it('should set the archive\'s page count correctly when post_count = 3 and posts_per_page=0', function () {
        var site = {
            prefix: '',
            url: 'http://example.com',
            archives_directory:'posts',
            archives_posts_per_page: 0
        };

        var archive = {
            uri: 'posts/tagged/foo',
            posts: [1, 2, 3]
        };
        paginate_archive(site, archive);
        expect(archive.page_count).to.equal(1);

    });

    it('should set the archive\'s page count correctly when post_count = 11 and posts_per_page=10', function () {
        var site = {
            prefix: '',
            url: 'http://example.com',
            archives_directory:'posts',
            archives_posts_per_page: 10
        };

        var archive = {
            uri: 'posts/tagged/foo',
            posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        };
        paginate_archive(site, archive);
        expect(archive.page_count).to.equal(2);

    });

    it('should set the archive\'s page count correctly when post_count = 11 and posts_per_page=0', function () {
        var site = {
            prefix: '',
            url: 'http://example.com',
            archives_directory:'posts',
            archives_posts_per_page: 0
        };

        var archive = {
            uri: 'posts/tagged/foo',
            posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        };
        paginate_archive(site, archive);
        expect(archive.page_count).to.equal(1);

    });

    it('should paginate correctly when post_count = 11 and posts_per_page=10', function () {
        var site = {
            prefix: '',
            url: 'http://example.com',
            archives_directory:'posts',
            archives_posts_per_page: 10
        };

        var archive = {
            uri: 'posts/tagged/foo',
            posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        };
        paginate_archive(site, archive);
        expect(archive.pages[0].posts[0]).to.equal(1);
        expect(archive.pages[0].posts[9]).to.equal(10);
        expect(archive.pages[1].posts[0]).to.equal(11);

    });

    it('should paginate correctly when post_count = 11 and posts_per_page=0', function () {
        var site = {
            prefix: '',
            url: 'http://example.com',
            archives_directory:'posts',
            archives_posts_per_page: 0
        };

        var archive = {
            uri: 'posts/tagged/foo',
            posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        };
        paginate_archive(site, archive);
        expect(archive.pages[0].posts[0]).to.equal(1);
        expect(archive.pages[0].posts[9]).to.equal(10);
        expect(archive.pages[0].posts[10]).to.equal(11);

    });

    it('should set the page uris correctly when post_count = 11 and posts_per_page=10', function () {
        var site = {
            prefix: '',
            url: 'http://example.com',
            archives_directory:'posts',
            archives_posts_per_page: 10,
            archives_page_slug: 'p'
        };

        var archive = {
            uri: 'posts/tagged/foo',
            posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        };
        paginate_archive(site, archive);
        expect(archive.pages[0].uri).to.equal('posts/tagged/foo');
        expect(archive.pages[1].uri).to.equal('posts/tagged/foo/p/2');
    });





});

