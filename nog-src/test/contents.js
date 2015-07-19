/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var _ = require('lodash');

var async = require('async');
var fs = require('fs-extra');
var path = require('path');
var temp = require('temp').track();

var data = require('../data');
var contents = require('../contents');

var test_helpers = require('./test_helpers');



describe('contents', function() {


    describe('#get_archives (pagination when the number of posts is 11 and posts_per_page = 5)', function () {

        var results;
        var input_directory;
        var archives;
        var build_data;
        var test_contents = [
            {slugs: ['updates', 'first.md'], meta: {tags: 'foo', date: '2015/07/15 09:30'}},
            {slugs: ['updates', 'second.md'], meta: {tags: 'foo', date: '2015/07/15 10:00'}},
            {slugs: ['updates', 'third.md'], meta: {tags: 'foo', date: '2015/07/15 11:15'}},
            {slugs: ['updates', 'fourth.md'], meta: {tags: 'foo', date: '2015/07/15 14:40'}},
            {slugs: ['updates', 'fifth.md'], meta: {tags: 'foo', date: '2015/07/15 14:41'}},
            {slugs: ['updates', 'sixth.md'], meta: {tags: 'foo', date: '2015/07/15 14:42'}},
            {slugs: ['updates', 'seventh.md'], meta: {tags: 'foo', date: '2015/07/15 14:43'}},
            {slugs: ['updates', 'eighth.md'], meta: {tags: 'foo', date: '2015/07/15 14:44'}},
            {slugs: ['updates', 'ninth.md'], meta: {tags: 'foo', date: '2015/07/15 14:45'}},
            {slugs: ['updates', 'tenth.md'], meta: {tags: 'foo', date: '2015/07/15 15:45'}},
            {slugs: ['updates', 'eleventh.md'], meta: {tags: 'foo', date: '2015/07/15 16:45'}},
        ];
        before(function (done) {
            var test_cfg = {
                archives_directory: 'updates',
                archives_posts_per_page: 5,
                build: {content_extensions: ['.md', '.html']}
            };
            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function (callback) {
                        test_helpers.set_contents(input_directory, test_contents, callback);
                    },
                    function (callback) {
                        test_helpers.set_config(input_directory, test_cfg, callback);
                    },
                    function (callback) {
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    }
                ],
                function () {
                    archives = contents.get_archives(build_data);
                    done();
                }
            );
        });
        it('should set post_count to 11 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.post_count).to.equal(11);
            });
        });
        it('should set is_paged to true in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.is_paged).to.equal(true);
            });
        });
        it('should set page_count to 3 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.page_count).to.equal(3);
            });
        });
        it('should set pages to an array with length 3 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages).to.be.an('array');
                expect(archive.pages).to.have.length(3)
            });
        });

        it('should set the number of posts on the first page to 5 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[0].post_count).to.equal(5);
            });
        });
        it('should set the number of posts on the second page to 5 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[1].post_count).to.equal(5);
            });
        });
        it('should set the number of posts on the third page to 1 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[2].post_count).to.equal(1);
            });
        });

        it('should set the first post on the first page to be most recent post in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[0].posts[0]).to.equal(build_data.contents['updates/eleventh.md']);
            });
        });

        it('should set the last post on the first page to be the fifth most recent post in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[0].posts[4]).to.equal(build_data.contents['updates/seventh.md']);
            });
        });

        it('should set the first post on the second page to be the sixth most recent post in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[1].posts[0]).to.equal(build_data.contents['updates/sixth.md']);
            });
        });

        it('should set the last post on the last page to be oldest post in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[2].posts[0]).to.equal(build_data.contents['updates/first.md']);
            });
        });
    });

    describe('#get_archives (pagination when the number of posts is 11 and posts_per_page = 0)', function () {

        var results;
        var input_directory;
        var archives;
        var build_data;
        var test_contents = [
            {slugs: ['updates', 'first.md'], meta: {tags: 'foo', date: '2015/07/15 09:30'}},
            {slugs: ['updates', 'second.md'], meta: {tags: 'foo', date: '2015/07/15 10:00'}},
            {slugs: ['updates', 'third.md'], meta: {tags: 'foo', date: '2015/07/15 11:15'}},
            {slugs: ['updates', 'fourth.md'], meta: {tags: 'foo', date: '2015/07/15 14:40'}},
            {slugs: ['updates', 'fifth.md'], meta: {tags: 'foo', date: '2015/07/15 14:41'}},
            {slugs: ['updates', 'sixth.md'], meta: {tags: 'foo', date: '2015/07/15 14:42'}},
            {slugs: ['updates', 'seventh.md'], meta: {tags: 'foo', date: '2015/07/15 14:43'}},
            {slugs: ['updates', 'eighth.md'], meta: {tags: 'foo', date: '2015/07/15 14:44'}},
            {slugs: ['updates', 'ninth.md'], meta: {tags: 'foo', date: '2015/07/15 14:45'}},
            {slugs: ['updates', 'tenth.md'], meta: {tags: 'foo', date: '2015/07/15 15:45'}},
            {slugs: ['updates', 'eleventh.md'], meta: {tags: 'foo', date: '2015/07/15 16:45'}},
        ];
        before(function (done) {
            var test_cfg = {
                archives_directory: 'updates',
                archives_posts_per_page: 0,
                build: {content_extensions: ['.md', '.html']}
            };
            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function (callback) {
                        test_helpers.set_contents(input_directory, test_contents, callback);
                    },
                    function (callback) {
                        test_helpers.set_config(input_directory, test_cfg, callback);
                    },
                    function (callback) {
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    }
                ],
                function () {
                    archives = contents.get_archives(build_data);
                    done();
                }
            );
        });
        it('should set post_count to 11 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.post_count).to.equal(11);
            });
        });
        it('should set is_paged to false in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.is_paged).to.equal(false);
            });
        });
        it('should set page_count to 1 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.page_count).to.equal(1);
            });
        });
        it('should set pages to an array with length 1 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages).to.be.an('array');
                expect(archive.pages).to.have.length(1)
            });
        });

        it('should set the number of posts on the first page to 11 in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[0].post_count).to.equal(11);
                expect(archive.pages[0].posts.length).to.equal(11);
            });
        });


        it('should set the first post on the first page to be most recent post in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[0].posts[0]).to.equal(build_data.contents['updates/eleventh.md']);
            });
        });

        it('should set the last post on the first page to be the 11th most recent post in all archives', function () {
            var indiv_archives = [archives.main, archives.tags.foo, archives.dates['2015'], archives.dates['2015/07'], archives.dates['2015/07/15']];
            _.each(indiv_archives, function (archive) {
                expect(archive.pages[0].posts[10]).to.equal(build_data.contents['updates/first.md']);
            });
        });


    });

    describe('#init_archives()', function () {

        var input_directory;
        var build_data;
        var test_contents = [];
        var test_cfg = {
            url: 'http://example.com',
            prefix: 'prefix',
            archives_directory: 'updates',
            archives_title: 'Updates',
            content_extensions: ['.md', '.html'],
        };


        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function (callback) {
                        test_helpers.set_contents(input_directory, test_contents, callback);
                    },
                    function (callback) {
                        test_helpers.set_config(input_directory, test_cfg, callback);
                    },
                    function (callback) {
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    }
                ],
                function () {
                    done();
                }
            );


        });

        it('should return an object', function () {
            var val;
            val = contents.init_archives(build_data);
            expect(val).to.be.an('object');
        });
        it('should set archives.main as an object', function () {
            var val;
            val = contents.init_archives(build_data);
            expect(val.main).to.be.an('object');
        });
        it('should set archives.main.type correctly', function () {
            var val;
            val = contents.init_archives(build_data);
            expect(val.main.type).to.equal('main');
        });
        it('should set archives.main.title correctly', function () {
            var val;
            val = contents.init_archives(build_data);
            expect(val.main.title).to.equal('Updates');
        });
        it('should set archives.main.relative_url correctly', function () {
            var val;
            val = contents.init_archives(build_data);
            expect(val.main.relative_url).to.equal('/prefix/updates/');
        });
        it('should set archives.main.absolute_url correctly', function () {
            var val;
            val = contents.init_archives(build_data);
            expect(val.main.absolute_url).to.equal('http://example.com/prefix/updates/');
        });
        it('should set archives.main.posts to be an empty array', function () {
            var val;
            val = contents.init_archives(build_data);
            expect(val.main.posts).to.be.an('array');
            expect(val.main.posts).to.have.length(0);
        });
        it('should set archives.dates to be an empty object', function () {
            var val;
            val = contents.init_archives(build_data);
            expect(val.dates).to.be.an('object');
            expect(_.size(val.dates)).to.equal(0);
        });
        it('should set archives.tags to be an empty object', function () {
            var val;
            val = contents.init_archives(build_data);
            expect(val.tags).to.be.an('object');
            expect(_.size(val.tags)).to.equal(0);
        });
        it('should set the urls correctly if config.prefix=""', function () {
            var val;
            build_data.config.prefix = '';
            val = contents.init_archives(build_data);
            expect(val.main.relative_url).to.equal('/updates/');
            expect(val.main.absolute_url).to.equal('http://example.com/updates/');
        });
    });

    describe('#get_posts()', function () {

        var results;
        var input_directory;
        var build_data;
        var test_contents = [
            {slugs: ['foo.md'], meta: {tags: 'foo', date: '2015/07/15'}},
            {slugs: ['updates', 'my-first-post.md'], meta: {tags: 'bar', date: '2014/07/15'}},
            {slugs: ['updates', 'bar.css'], meta: {tags: 'foo', date: '2015/07/15'}},
            {slugs: ['updates', 'foo bar.md'], meta: {tags: 'foo', date: '2015/07/15'}},
            {slugs: ['updates', 'aaa.md'], meta: {tags: 'foo', date: '2015/07/15'}},
            {slugs: ['updates', 'aaa.html'], meta: {tags: 'foo', date: '2015/07/15'}},
            {slugs: ['updates', 'bbb.md'], meta: {tags: 'foo', date: '2015/07/15'}},
            {slugs: ['updates', 'bbb', 'index.md'], meta: {tags: 'foo', date: '2015/07/15'}},
            {slugs: ['updates', 'ccc.md'], meta: {published: false, tags: 'foo', date: '2015/07/15'}},
            {slugs: ['updates', 'ddd.md'], meta: {tags: 'foo', date: '2015/07/15'}},
        ];
        var test_cfg = {
            url: 'http://example.com',
            prefix: 'prefix',
            archives_directory: 'updates',
            archives_title: 'Updates',
            content_extensions: ['.md', '.html'],
        };

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function (callback) {
                        test_helpers.set_contents(input_directory, test_contents, callback);
                    },
                    function (callback) {
                        test_helpers.set_config(input_directory, test_cfg, callback);
                    },
                    function (callback) {
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    }
                ],
                function () {
                    done();
                }
            );
        });

        it('should ignore content that is not a post', function () {
            var val;
            val = contents.get_posts(build_data);
            expect(val).not.to.contain(build_data.contents['foo.md']);

        });
        it('should ignore content that that has an invalid ext', function () {
            var val;
            val = contents.get_posts(build_data);
            expect(val).not.to.contain(build_data.contents['updates/bar.css']);

        });
        it('should ignore content that that has an invalid uri', function () {
            var val;
            val = contents.get_posts(build_data);
            expect(val).not.to.contain(build_data.contents['updates/foo bar.md']);

        });

        it('should ignore content that is overridden by a sibling', function () {
            var val;
            val = contents.get_posts(build_data);
            expect(val).not.to.contain(build_data.contents['updates/aaa.html']);
            expect(val).to.contain(build_data.contents['updates/aaa.md']);

        });
        it('should ignore content that is overridden by an index', function () {
            var val;
            val = contents.get_posts(build_data);
            expect(val).not.to.contain(build_data.contents['updates/bbb.md']);
            expect(val).to.contain(build_data.contents['updates/bbb/index.md']);

        });
        it('should ignore content that is unpublished', function () {
            var val;
            val = contents.get_posts(build_data);
            expect(val).not.to.contain(build_data.contents['updates/ccc.md']);

        });

        it('should not ignore content that is unpublished when is_build_public: false');


    });

    describe('#sort_posts()', function () {

        var results;
        var input_directory;
        var build_data;
        var test_contents = [
            {slugs: ['updates', 'first-by-date.md'], meta: {date: '2014/07/15 10:00'}},
            {slugs: ['updates', 'second-by-date.md'], meta: {date: '2014/07/15 9:00'}},
            {slugs: ['updates', 'first-by-title.md'], meta: {title: 'Abc', date: '2014/07/15 9:00'}},
            {slugs: ['updates', 'second-by-title.md'], meta: {title: 'Def', date: '2014/07/15 9:00'}},
            {slugs: ['updates', 'equal-by-title-1.md'], meta: {title: 'Ghi', date: '2014/07/15 9:00'}},
            {slugs: ['updates', 'equal-by-title-2.md'], meta: {title: 'Ghi', date: '2014/07/15 9:00'}},

        ];
        var test_cfg = {
            url: 'http://example.com',
            prefix: 'prefix',
            archives_directory: 'updates',
            archives_title: 'Updates',
            content_extensions: ['.md', '.html'],
        };
        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function (callback) {
                        test_helpers.set_contents(input_directory, test_contents, callback);
                    },
                    function (callback) {
                        test_helpers.set_config(input_directory, test_cfg, callback);
                    },
                    function (callback) {
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            results = _.values(build_data.contents);
                            contents.sort_posts(build_data, results);
                            callback(err);
                        })
                    }
                ],
                function () {
                    done();
                }
            );
        });

        it('should order posts by date desc', function () {
            var before = build_data.contents['updates/first-by-date.md'];
            var after = build_data.contents['updates/second-by-date.md'];
            expect(results.indexOf(before)).to.be.below(results.indexOf(after));
        });
        it('should order posts of equal date by title asc', function () {
            var before = build_data.contents['updates/first-by-title.md'];
            var after = build_data.contents['updates/second-by-title.md'];
            expect(results.indexOf(before)).to.be.below(results.indexOf(after));
        });


    });





    describe('#get_archives (pagination URLS when prefix is empty)', function () {

        var results;
        var archives;
        var input_directory;
        var build_data;
        var test_contents = [
            {slugs: ['updates', 'first.md'], meta: {tags: 'foo', date: '2015/07/15 09:30'}},
            {slugs: ['updates', 'second.md'], meta: {tags: 'foo', date: '2015/07/15 10:00'}},
            {slugs: ['updates', 'third.md'], meta: {tags: 'foo', date: '2015/07/15 11:15'}},
            {slugs: ['updates', 'fourth.md'], meta: {tags: 'foo', date: '2015/07/15 14:40'}},
            {slugs: ['updates', 'fifth.md'], meta: {tags: 'foo', date: '2015/07/15 14:41'}},
            {slugs: ['updates', 'sixth.md'], meta: {tags: 'foo', date: '2015/07/15 14:42'}},
            {slugs: ['updates', 'seventh.md'], meta: {tags: 'foo', date: '2015/07/15 14:43'}},
            {slugs: ['updates', 'eighth.md'], meta: {tags: 'foo', date: '2015/07/15 14:44'}},
            {slugs: ['updates', 'ninth.md'], meta: {tags: 'foo', date: '2015/07/15 14:45'}},
            {slugs: ['updates', 'tenth.md'], meta: {tags: 'foo', date: '2015/07/15 15:45'}},
            {slugs: ['updates', 'eleventh.md'], meta: {tags: 'foo', date: '2015/07/15 16:45'}},
        ];
        var test_cfg = {
            url: 'http://example.com',
            prefix: '',
            archives_directory: 'updates',
            archives_posts_per_page: 5,
            archives_page_slug: 'p',
            archives_tag_slug: 'tagged',
            content_extensions: ['.md', '.html']
        };

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function (callback) {
                        test_helpers.set_contents(input_directory, test_contents, callback);
                    },
                    function (callback) {
                        test_helpers.set_config(input_directory, test_cfg, callback);
                    },
                    function (callback) {
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    }
                ],
                function () {
                    archives = contents.get_archives(build_data);
                    done();
                }
            );
        });

        it('should set the URLs of the main archives correctly', function () {
            expect(archives.main.relative_url).to.equal('/updates/');
            expect(archives.main.absolute_url).to.equal('http://example.com/updates/');
        });
        it('should set the URLs of the first page of the main archives correctly', function () {
            expect(archives.main.pages[0].relative_url).to.equal('/updates/');
            expect(archives.main.pages[0].absolute_url).to.equal('http://example.com/updates/');
        });
        it('should set the URLs of the second page of the main archives correctly', function () {
            expect(archives.main.pages[1].relative_url).to.equal('/updates/p/2/');
            expect(archives.main.pages[1].absolute_url).to.equal('http://example.com/updates/p/2/');
        });
        it('should set the URLs of the third page of the main archives correctly', function () {
            expect(archives.main.pages[2].relative_url).to.equal('/updates/p/3/');
            expect(archives.main.pages[2].absolute_url).to.equal('http://example.com/updates/p/3/');
        });

        it('should set the URLs of the foo tag archives correctly', function () {
            expect(archives.tags.foo.relative_url).to.equal('/updates/tagged/foo/');
            expect(archives.tags.foo.absolute_url).to.equal('http://example.com/updates/tagged/foo/');
        });

        it('should set the URLs of the first page of the foo tag archives correctly', function () {
            expect(archives.tags.foo.pages[0].relative_url).to.equal('/updates/tagged/foo/');
            expect(archives.tags.foo.pages[0].absolute_url).to.equal('http://example.com/updates/tagged/foo/');
        });

        it('should set the URLs of the second page of the foo tag archives correctly', function () {
            expect(archives.tags.foo.pages[1].relative_url).to.equal('/updates/tagged/foo/p/2/');
            expect(archives.tags.foo.pages[1].absolute_url).to.equal('http://example.com/updates/tagged/foo/p/2/');
        });
        it('should set the URLs of the third page of the foo tag archives correctly', function () {
            expect(archives.tags.foo.pages[2].relative_url).to.equal('/updates/tagged/foo/p/3/');
            expect(archives.tags.foo.pages[2].absolute_url).to.equal('http://example.com/updates/tagged/foo/p/3/');
        });


        it('should set the URLs of the 2015 archives correctly', function () {
            expect(archives.dates['2015'].relative_url).to.equal('/updates/2015/');
            expect(archives.dates['2015'].absolute_url).to.equal('http://example.com/updates/2015/');
        });

        it('should set the URLs of the first page of the 2015 archives correctly', function () {
            expect(archives.dates['2015'].pages[0].relative_url).to.equal('/updates/2015/');
            expect(archives.dates['2015'].pages[0].absolute_url).to.equal('http://example.com/updates/2015/');
        });

        it('should set the URLs of the second page of the 2015 archives correctly', function () {
            expect(archives.dates['2015'].pages[1].relative_url).to.equal('/updates/2015/p/2/');
            expect(archives.dates['2015'].pages[1].absolute_url).to.equal('http://example.com/updates/2015/p/2/');
        });
        it('should set the URLs of the third page of the 2015 archives correctly', function () {
            expect(archives.dates['2015'].pages[2].relative_url).to.equal('/updates/2015/p/3/');
            expect(archives.dates['2015'].pages[2].absolute_url).to.equal('http://example.com/updates/2015/p/3/');
        });


        it('should set the URLs of the  2015/07 archives correctly', function () {
            expect(archives.dates['2015/07'].relative_url).to.equal('/updates/2015/07/');
            expect(archives.dates['2015/07'].absolute_url).to.equal('http://example.com/updates/2015/07/');
        });

        it('should set the URLs of the first page of the  2015/07 archives correctly', function () {
            expect(archives.dates['2015/07'].pages[0].relative_url).to.equal('/updates/2015/07/');
            expect(archives.dates['2015/07'].pages[0].absolute_url).to.equal('http://example.com/updates/2015/07/');
        });

        it('should set the URLs of the second page of the  2015/07 archives correctly', function () {
            expect(archives.dates['2015/07'].pages[1].relative_url).to.equal('/updates/2015/07/p/2/');
            expect(archives.dates['2015/07'].pages[1].absolute_url).to.equal('http://example.com/updates/2015/07/p/2/');
        });
        it('should set the URLs of the third page of the  2015/07 archives correctly', function () {
            expect(archives.dates['2015/07'].pages[2].relative_url).to.equal('/updates/2015/07/p/3/');
            expect(archives.dates['2015/07'].pages[2].absolute_url).to.equal('http://example.com/updates/2015/07/p/3/');
        });


        it('should set the URLs of the  2015/07/15 archives correctly', function () {
            expect(archives.dates['2015/07/15'].relative_url).to.equal('/updates/2015/07/15/');
            expect(archives.dates['2015/07/15'].absolute_url).to.equal('http://example.com/updates/2015/07/15/');
        });

        it('should set the URLs of the first page of the  2015/07/15 archives correctly', function () {
            expect(archives.dates['2015/07/15'].pages[0].relative_url).to.equal('/updates/2015/07/15/');
            expect(archives.dates['2015/07/15'].pages[0].absolute_url).to.equal('http://example.com/updates/2015/07/15/');
        });

        it('should set the URLs of the second page of the  2015/07/15 archives correctly', function () {
            expect(archives.dates['2015/07/15'].pages[1].relative_url).to.equal('/updates/2015/07/15/p/2/');
            expect(archives.dates['2015/07/15'].pages[1].absolute_url).to.equal('http://example.com/updates/2015/07/15/p/2/');
        });
        it('should set the URLs of the third page of the  2015/07/15 archives correctly', function () {
            expect(archives.dates['2015/07/15'].pages[2].relative_url).to.equal('/updates/2015/07/15/p/3/');
            expect(archives.dates['2015/07/15'].pages[2].absolute_url).to.equal('http://example.com/updates/2015/07/15/p/3/');
        });


    });



    describe('#get_search_index() -- basic', function () {

        var results;
        var build_data;
        var input_directory;
        var search_index;
        var tests = [
            {slugs: ['bad uri.md'], content: 'ohthisisabaduri'},
            {slugs: ['bad-ext.css'], content: 'ohthisisabadextension'},
            {slugs: ['updates.md'], content: 'ohthisconflictswiththearchive'},
            {slugs: ['foo.md'], content: 'thisisincludedbecauseitoverrides'},
            {slugs: ['foo.html'], content: 'ohthiscontentisoverrridden'},
            {slugs: ['aaa.md'], content: 'ohthiscontentisoverrriddenbyindex'},
            {slugs: ['aaa', 'index.md'], content: 'ohthiscontentisnotoverrriddenbyindex'},
            {slugs: ['not-published.md'], content: 'ohthiscontentisnotpublished', meta: {published: false}},
            {slugs: ['baz/index.md'], meta: {tags: 'foo, wannabe, fruit', title: 'rats'}, content: 'wannabe fruit'},
            {slugs: ['bar/index.md'], meta: {tags: 'foo, wannabe, fruit', title: 'rats'}, content: 'wannabe fruit'},

        ];
        var test_cfg = {
            url: 'http://example.com',
            prefix: '',
            archives_directory: 'updates', archives_posts_per_page: 5, archives_page_slug: 'p', archives_tag_slug: 'tagged',
            content_extensions: ['.md', '.html']
        };

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function (callback) {
                        test_helpers.set_contents(input_directory, tests, callback);
                    },
                    function (callback) {
                        test_helpers.set_config(input_directory, test_cfg, callback);
                    },
                    function (callback) {
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    }
                ],
                function () {
                    search_index = contents.get_search_index(build_data);
                    done();
                }
            );
        });

        it ('should return an object with two keys, index and content', function () {
            var val;

            expect(search_index.index).to.be.an('object');
            expect(search_index.content).to.be.an('object');
        });
        it ('should ignore content with a bad uri', function () {

            expect(search_index.index).not.to.include.keys('ohthisisabaduri');
        });
        it ('should ignore content with a bad ext', function () {

            expect(search_index.index).not.to.include.keys('ohthisisabadextension');
        });

        it ('should ignore content that conflicts with the archives', function () {

            expect(search_index.index).not.to.include.keys('ohthisconflictswiththearchive');
        });
        it ('should ignore content that is overridden by a sibling', function () {

            expect(search_index.index).not.to.include.keys('ohthiscontentisoverrridden');
        });
        it ('should include content that is not overridden by a sibling', function () {

            expect(search_index.index).to.include.keys('thisisincludedbecauseitoverrides');
        });

        it ('should ignore content that is overridden by an index', function () {

            expect(search_index.index).not.to.include.keys('ohthiscontentisoverrriddenbyindex');
        });
        it ('should include content that is not overridden by an index', function () {

            expect(search_index.index).to.include.keys('ohthiscontentisnotoverrriddenbyindex');
        });

        it ('should ignore content that is not published', function () {

            expect(search_index.index).not.to.include.keys('ohthiscontentisnotpublished');
        });

        it ('should set the values of index to be unique arrays', function () {

            _.each(search_index.index, function(arr){
                expect(arr).to.deep.equal(_.uniq(arr));
            });
        });


    });
});



