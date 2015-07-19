/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var async = require('async');
var moment = require('moment');
var fs = require('fs-extra');
var _ = require('lodash');
var sprintf =  require('sprintf-js').sprintf;
var temp = require('temp').track();
var yaml = require('js-yaml');
var S = require('string');


var atomic = require('../atomic');
var contents = require('../contents');
var data = require('../data');

var test_helpers = require('./test_helpers');


describe('atomic', function(){
    describe('#read()', function(){


        var input_directory;
        var build_data;

        before(function(done){

            async.series(
                [
                    function(callback){
                        temp.mkdir('nog-cli-test-', function(err, result){
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function(callback){
                        data.read(input_directory, true, function(err, result){
                            build_data = result;
                            callback(err);
                        })
                    }
                ],
                function(){
                    done();
                }
            );



        });

        it('should callback with an error for a path that does not exist', function(done){
            var tests = [
                {slugs: ['index.md']}
            ];
            test_helpers.set_contents(input_directory, tests, function(){
                atomic.read(build_data, path.join(input_directory, '_content', 'index.html'), function(err, result){
                    expect(err).to.be.an('error');
                    expect(result).to.be.null;
                    done();
                });
            })

        });
        it('should callback without an error for a path that does exist', function(done){
            var tests = [
                {slugs: ['index.md']}
            ];
            test_helpers.set_contents(input_directory, tests, function(){
                atomic.read(build_data, path.join(input_directory, '_content', 'index.md'), function(err, result){
                    expect(err).to.be.null;
                    expect(result).to.be.an('object');
                    done();
                });
            })

        });

        it('should set content.meta correctly as an object', function(done){
            var tests = [
                {slugs: ['index.md']}
            ];
            test_helpers.set_contents(input_directory, tests, function(){
                var absolute_path = path.join(input_directory, '_content', 'index.md');
                atomic.read(build_data, absolute_path, function(err, result){
                    expect(result.meta).to.be.an('object');
                    done();
                });
            })

        });

        it('should set content.meta.__content correctly as a string', function(done){
            var tests = [
                {slugs: ['index.md']}
            ];
            test_helpers.set_contents(input_directory, tests, function(){
                var absolute_path = path.join(input_directory, '_content', 'index.md');
                atomic.read(build_data, absolute_path, function(err, result){
                    expect(result.meta.__content).to.be.an('string');
                    done();
                });
            })

        });

        it('should set content.stat correctly as an object', function(done){
            var tests = [
                {slugs: ['index.md']}
            ];
            test_helpers.set_contents(input_directory, tests, function(){
                var absolute_path = path.join(input_directory, '_content', 'index.md');
                atomic.read(build_data, absolute_path, function(err, result){
                    expect(result.stat).to.be.an('object');
                    done();
                });
            })

        });

        it('should set content.stat.mtime correctly as a date', function(done){
            var tests = [
                {slugs: ['index.md']}
            ];
            test_helpers.set_contents(input_directory, tests, function(){
                var absolute_path = path.join(input_directory, '_content', 'index.md');
                atomic.read(build_data, absolute_path, function(err, result){
                    expect(result.stat.mtime).to.be.an('date');
                    done();
                });
            })

        });

        it('should set content.absolute_path correctly', function(done){
            var tests = [
                {slugs: ['index.md']}
            ];
            test_helpers.set_contents(input_directory, tests, function(){
                var absolute_path = path.join(input_directory, '_content', 'index.md');
                atomic.read(build_data, absolute_path, function(err, result){
                    expect(result.absolute_path).to.equal(absolute_path);
                    done();
                });
            })

        });

        it('should set content.relative_path correctly', function(done){
            var tests = [
                {slugs: ['index.md']}
            ];
            test_helpers.set_contents(input_directory, tests, function(){
                var absolute_path = path.join(input_directory, '_content', 'index.md');
                atomic.read(build_data, absolute_path, function(err, result){
                    expect(result.relative_path).to.equal('index.md');
                    done();
                });
            })

        });

    });

    describe('#get_basename()', function() {
        var input_directory;
        var build_data;
        var tests = [
            {slugs: ['index.md']},
            {slugs: ['index.html']},
            {slugs: ['foo', 'bar.html']},
        ];

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function(callback){
                        test_helpers.set_contents(input_directory, tests, callback);
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



        it('should return "index" for index.md', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'index.md');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_basename(build_data, result)).to.equal('index');
                done();
            });

        });
        it('should return "index" for index.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'index.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_basename(build_data, result)).to.equal('index');
                done();
            });

        });
        it('should return "bar" for foo/bar.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo', 'bar.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_basename(build_data, result)).to.equal('bar');
                done();
            });

        });
    });

    describe('#get_uri()', function() {
        var input_directory;
        var build_data;
        var tests = [
            {slugs: ['index.md']},
            {slugs: ['index.html']},
            {slugs: ['foo', 'bar.html']},
            {slugs: ['foo', 'index.html']},
            {slugs: ['foo.html']},
        ];

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    },
                    function(callback){
                        test_helpers.set_contents(input_directory, tests, callback);
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



        it('should return "" for index.md', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'index.md');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_uri(build_data, result)).to.equal('');
                done();
            });

        });
        it('should return "" for index.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'index.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_uri(build_data, result)).to.equal('');
                done();
            });

        });
        it('should return "foo/bar" for foo/bar.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo', 'bar.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_uri(build_data, result)).to.equal('foo/bar');
                done();
            });

        });
        it('should return "foo" for foo/index.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo', 'index.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_uri(build_data, result)).to.equal('foo');
                done();
            });

        });
        it('should return "foo" for foo.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_uri(build_data, result)).to.equal('foo');
                done();
            });

        });
    });

    describe('#get_type() when config.archives.directory = "updates"', function() {
        var input_directory;
        var build_data;
        var tests = [
            {slugs: ['index.md']},
            {slugs: ['index.html']},
            {slugs: ['foo', 'bar.html']},
            {slugs: ['foo', 'index.html']},
            {slugs: ['foo.html']},
            {slugs: ['updates', 'foo.html']},
            {slugs: ['updates', 'foo', 'index.html']},
            {slugs: ['updates', 'foo', 'bar.html']},
        ];
        var test_config = {
            archives_directory: 'updates'
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
                    function(callback){
                        test_helpers.set_config(input_directory, test_config, callback);
                    },
                    function(callback){
                        test_helpers.set_contents(input_directory, tests, callback);
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



        it('should return "index" for index.md', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'index.md');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('index');
                done();
            });

        });
        it('should return "index" for index.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'index.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('index');
                done();
            });

        });
        it('should return "page" for foo/bar.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo', 'bar.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('page');
                done();
            });

        });
        it('should return "page" for foo/index.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo', 'index.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('page');
                done();
            });

        });
        it('should return "page" for foo.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('page');
                done();
            });

        });
        it('should return "post" for updates/foo.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'updates', 'foo.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('post');
                done();
            });

        });
        it('should return "post" for updates/foo/index.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'updates', 'foo', 'index.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('post');
                done();
            });

        });
        it('should return "post" for updates/foo/bar.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'updates', 'foo', 'bar.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('post');
                done();
            });

        });
    });

    describe('#get_type() when config.archives.directory = ""', function() {
        var input_directory;
        var build_data;
        var tests = [
            {slugs: ['index.md']},
            {slugs: ['index.html']},
            {slugs: ['foo', 'bar.html']},
            {slugs: ['foo', 'index.html']},
            {slugs: ['foo.html']},
            {slugs: ['updates', 'foo.html']},
            {slugs: ['updates', 'foo', 'index.html']},
            {slugs: ['updates', 'foo', 'bar.html']},
        ];
        var test_config = {
            archives_directory: ''
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
                    function(callback){
                        test_helpers.set_config(input_directory, test_config, callback);
                    },
                    function(callback){
                        test_helpers.set_contents(input_directory, tests, callback);
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



        it('should return "index" for index.md', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'index.md');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('index');
                done();
            });

        });
        it('should return "index" for index.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'index.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('index');
                done();
            });

        });
        it('should return "page" for foo/bar.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo', 'bar.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('page');
                done();
            });

        });
        it('should return "page" for foo/index.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo', 'index.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('page');
                done();
            });

        });
        it('should return "page" for foo.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'foo.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('page');
                done();
            });

        });
        it('should return "page" for updates/foo.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'updates', 'foo.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('page');
                done();
            });

        });
        it('should return "page" for updates/foo/index.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'updates', 'foo', 'index.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(atomic.get_type(build_data, result)).to.equal('page');
                done();
            });

        });
        it('should return "page" for updates/foo/bar.html', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'updates', 'foo', 'bar.html');
            atomic.read(build_data, absolute_path, function(err, result){
                expect(build_data.config.archives_directory).to.equal('');
                expect(atomic.get_type(build_data, result)).to.equal('page');
                done();
            });

        });
    });

    describe('#get_published() when is_build_public = true', function() {
        var input_directory;
        var build_data;
        var tests = [
            {slugs: ['unpublished.md'], meta: {published: false}},
            {slugs: ['published-bad-meta.md'],  meta: {published: {}}},
            {slugs: ['published-true-meta.md'],  meta: {published: true}},
            {slugs: ['published-no-meta.md']},
        ];


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


        it('should return false for unpublished.md with lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'unpublished.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_published(build_data, result)).to.equal(false);
                expect(result.lint).to.include.keys('published');
                done();
            });

        });
        it('should return true for published-true-meta.md, without lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'published-true-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_published(build_data, result)).to.equal(true);
                expect(result.lint).not.to.include.keys('published');

                done();
            });

        });
        it('should return true for published-bad-meta.md, with lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'published-bad-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_published(build_data, result)).to.equal(true);
                expect(result.lint).to.include.keys('published');
                done();
            });

        });
        it('should return true for published-no-meta.md, without lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'published-no-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_published(build_data, result)).to.equal(true);
                expect(result.lint).not.to.include.keys('published');
                done();
            });

        });
    });

    describe('#get_published() when is_build_public = false', function() {
        var input_directory;
        var build_data;
        var tests = [
            {slugs: ['unpublished.md'], meta: {published: false}},
            {slugs: ['published-bad-meta.md'],  meta: {published: {}}},
            {slugs: ['published-true-meta.md'],  meta: {published: true}},
            {slugs: ['published-no-meta.md']},
        ];


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
                        data.read(input_directory, false, function (err, result) {
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


        it('should return true for unpublished.md with lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'unpublished.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_published(build_data, result)).to.equal(true);
                expect(result.lint).to.include.keys('published');
                done();
            });

        });
        it('should return true for published-true-meta.md, without lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'published-true-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_published(build_data, result)).to.equal(true);
                expect(result.lint).not.to.include.keys('published');

                done();
            });

        });
        it('should return true for published-bad-meta.md, with lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'published-bad-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_published(build_data, result)).to.equal(true);
                expect(result.lint).to.include.keys('published');
                done();
            });

        });
        it('should return true for published-no-meta.md, without lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'published-no-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_published(build_data, result)).to.equal(true);
                expect(result.lint).not.to.include.keys('published');
                done();
            });

        });
    });


    describe('#get_title()', function() {
        var input_directory;
        var build_data;
        var tests = [
            {slugs: ['good-meta.md'], meta: {title: 'good'}},
            {slugs: ['good-meta-trim.md'], meta: {title: '    good   '}},
            {slugs: ['bad-meta.md'], meta: {title: {}}},
            {slugs: ['empty-meta.md'], meta: {title: '   '}},
            {slugs: ['no-meta.md']},
        ];


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


        it('should return the basename for if title is not set in the meta, with lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'no-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_title(build_data, result)).to.equal('no-meta');
                expect(result.lint).to.include.keys('title');
                done();
            });
        });
        it('should return the basename for if title is not set to a string in the meta, with lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'bad-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_title(build_data, result)).to.equal('bad-meta');
                expect(result.lint).to.include.keys('title');
                done();
            });
        });
        it('should return the basename for if title is set to an empty string in the meta, with lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'empty-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_title(build_data, result)).to.equal('empty-meta');
                expect(result.lint).to.include.keys('title');
                done();
            });
        });
        it('should return the title is set to a non-empty string in the meta, without lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'good-meta.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_title(build_data, result)).to.equal('good');
                expect(result.lint).not.to.include.keys('title');
                done();
            });
        });
        it('should return the title trimmed, without lint', function (done) {
            var absolute_path = path.join(input_directory, '_content', 'good-meta-trim.md');
            atomic.read(build_data, absolute_path, function (err, result) {
                expect(atomic.get_title(build_data, result)).to.equal('good');
                expect(result.lint).not.to.include.keys('title');
                done();
            });
        });
    });


    describe('#get_date()', function() {
        var input_directory;
        var build_data;
        var content;
        var tests = [
            {slugs: ['meta.md']}
        ];


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
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    },
                    function (callback) {
                        var absolute_path = path.join(input_directory, '_content', 'meta.md');
                        atomic.read(build_data, absolute_path, function (err, result) {
                            content = result;
                            callback();
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });

        afterEach(function(){
            content.lint = _.omit(content.lint, 'date');
        });


        it('should return the stat.mtime  if date is not set in the meta, with lint', function () {
            expect(atomic.get_date(build_data, content).valueOf()).to.equal(moment(content.stat.mtime).valueOf());
            expect(content.lint).to.include.keys('date');
        });
        it('should return the stat.mtime  if date is not parsable "July 4, 2015" in the meta, with lint', function () {
            content.meta.date = 'July 4, 2015';
            expect(atomic.get_date(build_data, content).valueOf()).to.equal(moment(content.stat.mtime).valueOf());
            expect(content.lint).to.include.keys('date');
        });
        it('should return the stat.mtime  if date is not parsable "12/12/2015" in the meta, with lint', function () {
            content.meta.date = '12/12/2015';
            expect(atomic.get_date(build_data, content).valueOf()).to.equal(moment(content.stat.mtime).valueOf());
            expect(content.lint).to.include.keys('date');
        });
        it('should return the stat.mtime  if date is not parsable "   " in the meta, with lint', function () {
            content.meta.date = '    ';
            expect(atomic.get_date(build_data, content).valueOf()).to.equal(moment(content.stat.mtime).valueOf());
            expect(content.lint).to.include.keys('date');
        });
        it('should return the stat.mtime  if date is an object in the meta, with lint', function () {
            content.meta.date = {};
            expect(atomic.get_date(build_data, content).valueOf()).to.equal(moment(content.stat.mtime).valueOf());
            expect(content.lint).to.include.keys('date');
        });
        it('should return the date if it is the parsable string "2015/07/16" in the meta, without lint', function () {
            content.meta.date = '2015/07/16';
            expect(atomic.get_date(build_data, content).valueOf()).to.equal(moment('2015/07/16', 'YYYY/MM/DD').valueOf());
            expect(content.lint).not.to.include.keys('date');
        });

        it('should return the date if it is the parsable string "2015/07/16 3:30" in the meta, without lint', function () {
            content.meta.date = '2015/07/16 3:30';
            expect(atomic.get_date(build_data, content).valueOf()).to.equal(moment('2015/07/16 3:30', 'YYYY/MM/DD HH:mm').valueOf());
            expect(content.lint).not.to.include.keys('date');
        });

        it('should return the date if it is the parsable string "   2015/07/16 3:30   " in the meta, without lint', function () {
            content.meta.date = '    2015/07/16 3:30     ';
            expect(atomic.get_date(build_data, content).valueOf()).to.equal(moment('2015/07/16 3:30', 'YYYY/MM/DD HH:mm').valueOf());
            expect(content.lint).not.to.include.keys('date');

        });

    });

    describe('#get_content()', function() {
        var input_directory;
        var build_data;
        var content;
        var tests = [
            {slugs: ['meta.md']}
        ];


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
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    },
                    function (callback) {
                        var absolute_path = path.join(input_directory, '_content', 'meta.md');
                        atomic.read(build_data, absolute_path, function (err, result) {
                            content = result;
                            callback();
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });

        afterEach(function(){
            content.lint = _.omit(content.lint, 'content');
        });



        it('should return an empty string  if meta.__content is empty, with lint', function () {
            content.meta.__content = '     ';
            expect(atomic.get_content(build_data, content).valueOf()).to.equal('');
            expect(content.lint).to.include.keys('content');
        });

        it('should remove the excerpt token when the result is empty', function () {
            content.meta.__content = '   <!-- excerpt -->  <!--excerpt -->  ';
            expect(atomic.get_content(build_data, content).valueOf()).to.equal('');
            expect(content.lint).to.include.keys('content');
        });
        it('should remove the excerpt token when the result is not empty', function () {
            content.meta.__content = 'Foo   <!-- excerpt -->  <!--excerpt -->  ';
            expect(atomic.get_content(build_data, content).valueOf()).to.equal('<p>Foo</p>');
            expect(content.lint).not.to.include.keys('content');
        });

    });

    describe('#get_excerpt()', function() {
        var input_directory;
        var build_data;
        var content;
        var tests = [
            {slugs: ['meta.md']}
        ];


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
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    },
                    function (callback) {
                        var absolute_path = path.join(input_directory, '_content', 'meta.md');
                        atomic.read(build_data, absolute_path, function (err, result) {
                            content = result;
                            callback();
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });

        afterEach(function(){
            content.lint = _.omit(content.lint, 'excerpt');
            content.meta = _.omit(content.meta, 'excerpt', '__content');
        });



        it('should return an empty string  if meta.__content is empty, with lint', function () {
            content.meta.__content = '     ';
            expect(atomic.get_excerpt(build_data, content).valueOf()).to.equal('');
            expect(content.lint).to.include.keys('excerpt');
        });

        it('should return an empty string  if meta.__content and meta.excerpt are empty, with lint', function () {
            content.meta.__content = '     ';
            content.meta.excerpt = '     ';

            expect(atomic.get_excerpt(build_data, content).valueOf()).to.equal('');
            expect(content.lint).to.include.keys('excerpt');
        });

        it('should return an empty string  if meta.__content is empty and meta.excerpt is not a string, with lint', function () {
            content.meta.__content = '     ';
            content.meta.excerpt = /fff/;

            expect(atomic.get_excerpt(build_data, content).valueOf()).to.equal('');
            expect(content.lint).to.include.keys('excerpt');
        });

        it('should return the text before the excerpt token if it exists', function () {
            content.meta.__content = 'Foo bar   <!-- excerpt --> ';
            expect(atomic.get_excerpt(build_data, content).valueOf()).to.equal('Foo bar');
            expect(content.lint).not.to.include.keys('excerpt');
        });
        it('should return the text before the excerpt token if both it exists and meta.excerpt exists', function () {
            content.meta.__content = 'Foo bar   <!-- excerpt --> ';
            content.meta.excerpt = 'WWoooo';
            expect(atomic.get_excerpt(build_data, content).valueOf()).to.equal('Foo bar');
            expect(content.lint).not.to.include.keys('excerpt');
        });
        it('should return the text before the excerpt token if  it exists and meta.excerpt does not exist', function () {
            content.meta.__content = 'Foo bar   <!-- excerpt --> ';
            expect(atomic.get_excerpt(build_data, content).valueOf()).to.equal('Foo bar');
            expect(content.lint).not.to.include.keys('excerpt');
        });
        it('should return meta.excerpt if it exists and the excerpt token does not', function () {
            content.meta.__content = ' ';
            content.meta.excerpt = 'WWoooo';
            expect(atomic.get_excerpt(build_data, content).valueOf()).to.equal('WWoooo');
            expect(content.lint).not.to.include.keys('excerpt');
        });
        it('should return meta.excerpt if it exists and the excerpt token results in an empty string', function () {
            content.meta.__content = ' <!-- excerpt --> gisjisij';
            content.meta.excerpt = 'WWoooo';
            expect(atomic.get_excerpt(build_data, content).valueOf()).to.equal('WWoooo');
            expect(content.lint).not.to.include.keys('excerpt');
        });


    });

    describe('#get_tags()', function(){
        var input_directory;
        var build_data;
        var content;
        var tests = [
            {slugs: ['meta.md']}
        ];


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
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    },
                    function (callback) {
                        var absolute_path = path.join(input_directory, '_content', 'meta.md');
                        atomic.read(build_data, absolute_path, function (err, result) {
                            content = result;
                            callback();
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });

        afterEach(function(){
            content.meta = _.omit(content.meta, 'tags');
        });

        it('should return an empty array if tags is not set in the meta', function () {
            expect(atomic.get_tags(build_data, content)).to.have.length(0);
        });
        it('should return an array if tags is an array in the meta', function () {
            content.meta.tags = ['foo', 'bar'];
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['foo', 'bar']);

        });
        it('should return an array if tags is a string in the meta', function () {
            content.meta.tags = 'foo,bar';
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['foo', 'bar']);

        });
        it('should return an empty array if tags is an empty string in the content meta', function () {
            content.meta.tags = '    ';
            expect(atomic.get_tags(build_data, content)).to.deep.equal([]);

        });
        it('should ignore tags that are not strings', function () {
            content.meta.tags = ['foo', {}, 'bar'];
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['foo', 'bar']);

        });
        it('should ignore empty tags if given an array', function () {
            content.meta.tags = ['foo', '', 'bar', '      '];
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['foo', 'bar']);

        });
        it('should ignore empty tags if given a string', function () {
            content.meta.tags = ' , foo,bar, , ';
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['foo', 'bar']);

        });
        it('should trim tags if given a string', function () {
            content.meta.tags = ' , foo,     bar, , ';
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['foo', 'bar']);

        });
        it('should trim tags if given an array', function () {
            content.meta.tags = ['foo    ', 'bar    '];
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['foo', 'bar']);

        });

        it('should remove duplicate tags in case-insensitive manner given a string', function () {
            content.meta.tags = 'foo,bar,FOO, Bar';
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['foo', 'bar']);

        });
        it('should remove duplicate tags in case-insensitive manner given an array', function () {
            content.meta.tags = ['foo', 'bar', 'Foo', 'Bar'];
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['foo', 'bar']);

        });

        it('should handle multi-word tags if given a string', function () {
            content.meta.tags = 'Foo Bar, Bar Foo';
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['Foo Bar', 'Bar Foo']);

        });
        it('should handle multi-word tags given an array', function () {
            content.meta.tags = [ 'Foo Bar', 'Bar Foo'];
            expect(atomic.get_tags(build_data, content)).to.deep.equal(['Foo Bar', 'Bar Foo']);

        });


    });





    describe('#get_search_words()', function () {
        var input_directory;
        var build_data;
        var content;
        var tests = [
            {slugs: ['meta.md']}
        ];


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
                        data.read(input_directory, true, function (err, result) {
                            build_data = result;
                            callback(err);
                        })
                    },
                    function (callback) {
                        var absolute_path = path.join(input_directory, '_content', 'meta.md');
                        atomic.read(build_data, absolute_path, function (err, result) {
                            content = result;
                            callback();
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });

        afterEach(function(){
            content.meta = _.omit(content.meta, 'tags', 'title', '__content', 'excerpt');
        });


        //hello is in the default stopwords array
        it ('should return whole words found in the content, by default filtered by english stop words', function () {
            content.meta = _.omit(content.meta, 'tags', 'title', '__content', 'excerpt');
            content.meta.__content = 'Hello World';
            content.meta.title = 'Hello';
            expect(atomic.get_search_words(build_data, content)).to.deep.equal(['world']);
        });
        it ('should return whole words found in the title, by default filtered by english stop words', function () {
            content.meta.title = 'Hello World';
            content.meta.__content = '';
            expect(atomic.get_search_words(build_data, content)).to.deep.equal(['world']);
        });
        it ('should return whole words found in the excerpt, by default filtered by english stop words', function () {
            content.meta.title = 'Hello';
            content.meta.__content = '';
            content.meta.excerpt = 'World';
            expect(atomic.get_search_words(build_data, content)).to.deep.equal(['world']);
        });
        it ('should include all the tags if content.tags is set, without filtering out stop words', function () {
            content.meta.title = 'Hello';
            content.meta.__content = '';
            content.meta.tags = 'Hello, World';
            expect(atomic.get_search_words(build_data, content)).to.deep.equal(['hello', 'world']);
        });
        it ('should remove dupes', function () {
            var val;
            content.meta.title = 'Hello World';
            content.meta.__content = 'hello world hello';
            content.meta.excerpt = 'hello world';
            content.meta.tags = 'Hello, World';
            val = atomic.get_search_words(build_data, content);
            expect(val).to.include('hello', 'world');
            expect(val).to.have.length(2);
        });



    });



    describe('#get_template', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });


        it('should return the user\'s "index.twig" for the home page if template is not set, with no lint', function (done) {
            var tests = [ {slugs: ['index.md']}];
            var templates = [['index.twig']];
            var test_config = {archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {

                test_helpers.set_templates(input_directory, templates, function(err){
                    test_helpers.set_config(input_directory, test_config, function(err){
                        data.read(input_directory, true, function(err, result){
                            var build_data = result;
                            var abs = path.join(build_data.content_directory, 'index.md');
                            atomic.read(build_data, abs, function(err, content){
                                var val = atomic.get_template(build_data, content);
                                expect(path.isAbsolute(val)).to.be.true;
                                expect(val.indexOf(input_directory)).to.equal(0);
                                expect(path.basename(val)).to.equal('index.twig');
                                expect(content.lint).not.to.include.keys('template');
                                done();
                            })

                        });
                    })
                })
            });
        });
        it('should return the default "index.twig" for the home page if template is not set, with lint', function (done) {
            var tests = [ {slugs: ['index.md']}];
            var templates = [];
            var test_config = {archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {

                test_helpers.set_templates(input_directory, templates, function(err){
                    test_helpers.set_config(input_directory, test_config, function(err){
                        data.read(input_directory, true, function(err, result){
                            var build_data = result;
                            var abs = path.join(build_data.content_directory, 'index.md');
                            atomic.read(build_data, abs, function(err, content){
                                var val = atomic.get_template(build_data, content);
                                expect(path.isAbsolute(val)).to.be.true;
                                expect(val.indexOf(input_directory)).not.to.equal(0);
                                expect(path.basename(val)).to.equal('index.twig');

                                expect(content.lint).to.include.keys('template');
                                done();
                            })

                        });
                    })
                })
            });
        });

        it('should return the user\'s custom template for the home page if template is set and the template exists, with no lint', function (done) {
            var tests = [ {slugs: ['index.md'], meta: {template: 'custom.twig'}}];
            var templates = [['custom.twig']];
            var test_config = {archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {

                test_helpers.set_templates(input_directory, templates, function(err){
                    test_helpers.set_config(input_directory, test_config, function(err){
                        data.read(input_directory, true, function(err, result){
                            var build_data = result;
                            var abs = path.join(build_data.content_directory, 'index.md');
                            atomic.read(build_data, abs, function(err, content){
                                var val = atomic.get_template(build_data, content);
                                expect(path.isAbsolute(val)).to.be.true;
                                expect(val.indexOf(input_directory)).to.equal(0);
                                expect(path.basename(val)).to.equal('custom.twig');
                                expect(content.lint).not.to.include.keys('template');
                                done();
                            })

                        });
                    })
                })
            });
        });

        it('should return the user\'s "index.twig" template for the home page if template is set and the template does not exist, with lint', function (done) {
            var tests = [ {slugs: ['index.md'], meta: {template: 'custom.twig'}}];
            var templates = [['index.twig']];
            var test_config = {archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {

                test_helpers.set_templates(input_directory, templates, function(err){
                    test_helpers.set_config(input_directory, test_config, function(err){
                        data.read(input_directory, true, function(err, result){
                            var build_data = result;
                            var abs = path.join(build_data.content_directory, 'index.md');
                            atomic.read(build_data, abs, function(err, content){
                                var val = atomic.get_template(build_data, content);
                                expect(path.isAbsolute(val)).to.be.true;
                                expect(val.indexOf(input_directory)).to.equal(0);
                                expect(path.basename(val)).to.equal('index.twig');
                                expect(content.lint).to.include.keys('template');
                                done();
                            })

                        });
                    })
                })
            });
        });

        it('should return the user\'s "index.twig" template for the home page if template is set other than a string, with no lint', function (done) {
            var tests = [ {slugs: ['index.md'], meta: {template: {}}}];
            var templates = [['index.twig']];
            var test_config = {archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {

                test_helpers.set_templates(input_directory, templates, function(err){
                    test_helpers.set_config(input_directory, test_config, function(err){
                        data.read(input_directory, true, function(err, result){
                            var build_data = result;
                            var abs = path.join(build_data.content_directory, 'index.md');
                            atomic.read(build_data, abs, function(err, content){
                                var val = atomic.get_template(build_data, content);
                                expect(path.isAbsolute(val)).to.be.true;
                                expect(val.indexOf(input_directory)).to.equal(0);
                                expect(path.basename(val)).to.equal('index.twig');
                                expect(content.lint).to.include.keys('template');
                                done();
                            })

                        });
                    })
                })
            });
        });

        it('should return the user\'s "post.twig" for a post if template is not set, with no lint', function (done) {
            var tests = [ {slugs: ['updates', 'post.md']}];
            var templates = [['post.twig']];
            var test_config = {archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_templates(input_directory, templates, function(err){
                    test_helpers.set_config(input_directory, test_config, function(err){
                        data.read(input_directory, true, function(err, result){
                            var build_data = result;
                            var abs = path.join(build_data.content_directory, 'updates', 'post.md');
                            atomic.read(build_data, abs, function(err, content){
                                var val = atomic.get_template(build_data, content);
                                expect(path.isAbsolute(val)).to.be.true;
                                expect(val.indexOf(input_directory)).to.equal(0);
                                expect(path.basename(val)).to.equal('post.twig');
                                expect(content.lint).not.to.include.keys('template');
                                done();
                            })

                        });
                    })
                })
            });
        });


    });

    describe('#get_relative_url()', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });
        it('should return the correct relative url for the home page when config.prefix is not empty', function (done) {
            var tests = [ {slugs: ['index.md']}];
            var test_config = {prefix: 'prefix', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_relative_url(build_data, content);
                            expect(val).to.equal('/prefix/');
                            done();
                        })

                    });
                });
            });
        });
        it('should return the correct relative url for the home page when config.prefix is empty', function (done) {
            var tests = [ {slugs: ['index.md']}];
            var test_config = {prefix: '', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_relative_url(build_data, content);
                            expect(val).to.equal('/');
                            done();
                        })

                    });
                });
            });
        });

        it('should return the correct relative url for foo.md when config.prefix is not empty', function (done) {
            var tests = [ {slugs: ['foo.md']}];
            var test_config = {prefix: 'prefix', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_relative_url(build_data, content);
                            expect(val).to.equal('/prefix/foo/');
                            done();
                        })

                    });
                });
            });
        });
        it('should return the correct relative url for foo.md when config.prefix is empty', function (done) {
            var tests = [ {slugs: ['foo.md']}];
            var test_config = {prefix: '', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_relative_url(build_data, content);
                            expect(val).to.equal('/foo/');
                            done();
                        })

                    });
                });
            });
        });


        it('should return the correct relative url for foo/index.md when config.prefix is not empty', function (done) {
            var tests = [ {slugs: ['foo', 'index.md']}];
            var test_config = {prefix: 'prefix', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo', 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_relative_url(build_data, content);
                            expect(val).to.equal('/prefix/foo/');
                            done();
                        })

                    });
                });
            });
        });
        it('should return the correct relative url for foo/index.md when config.prefix is empty', function (done) {
            var tests = [ {slugs: ['foo', 'index.md']}];
            var test_config = {prefix: '', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo', 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_relative_url(build_data, content);
                            expect(val).to.equal('/foo/');
                            done();
                        })

                    });
                });
            });
        });


    });

    describe('#get_absolute_url()', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });
        it('should return the correct absolute url for the home page when config.prefix is not empty', function (done) {
            var tests = [ {slugs: ['index.md']}];
            var test_config = {prefix: 'prefix', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_absolute_url(build_data, content);
                            expect(val).to.equal('http://example.com/prefix/');
                            done();
                        })

                    });
                });
            });
        });
        it('should return the correct absolute url for the home page when config.prefix is empty', function (done) {
            var tests = [ {slugs: ['index.md']}];
            var test_config = {prefix: '', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_absolute_url(build_data, content);
                            expect(val).to.equal('http://example.com/');
                            done();
                        })

                    });
                });
            });
        });

        it('should return the correct absolute url for foo.md when config.prefix is not empty', function (done) {
            var tests = [ {slugs: ['foo.md']}];
            var test_config = {prefix: 'prefix', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_absolute_url(build_data, content);
                            expect(val).to.equal('http://example.com/prefix/foo/');
                            done();
                        })

                    });
                });
            });
        });
        it('should return the correct absolute url for foo.md when config.prefix is empty', function (done) {
            var tests = [ {slugs: ['foo.md']}];
            var test_config = {prefix: '', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_absolute_url(build_data, content);
                            expect(val).to.equal('http://example.com/foo/');
                            done();
                        })

                    });
                });
            });
        });


        it('should return the correct absolute url for foo/index.md when config.prefix is not empty', function (done) {
            var tests = [ {slugs: ['foo', 'index.md']}];
            var test_config = {prefix: 'prefix', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo', 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_absolute_url(build_data, content);
                            expect(val).to.equal('http://example.com/prefix/foo/');
                            done();
                        })

                    });
                });
            });
        });
        it('should return the correct absolute url for foo/index.md when config.prefix is empty', function (done) {
            var tests = [ {slugs: ['foo', 'index.md']}];
            var test_config = {prefix: '', url: 'http://example.com'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo', 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_absolute_url(build_data, content);
                            expect(val).to.equal('http://example.com/foo/');
                            done();
                        })

                    });
                });
            });
        });


    });

    describe('#get_is_ignored_bad_uri()', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });
        it('should return true with lint for "foo bar.md"', function (done) {
            var tests = [ {slugs: ['foo bar.md']}];
            var test_config = {};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo bar.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_bad_uri(build_data, content);
                            expect(val).to.be.true;
                            expect(content.lint).to.include.keys('is_ignored_bad_uri')
                            done();
                        })

                    });
                });
            });
        });

        it('should return true with lint for "foo bar/foo.md"', function (done) {
            var tests = [ {slugs: ['foo bar', 'foo.md']}];
            var test_config = {};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo bar',  'foo.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_bad_uri(build_data, content);
                            expect(val).to.be.true;
                            expect(content.lint).to.include.keys('is_ignored_bad_uri');
                            done();
                        })

                    });
                });
            });
        });
        it('should return false without lint for index.md', function (done) {
            var tests = [ {slugs: ['index.md']}];
            var test_config = {};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory,  'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_bad_uri(build_data, content);
                            expect(val).to.be.false;
                            expect(content.lint).not.to.include.keys('is_ignored_bad_uri');
                            done();
                        })

                    });
                });
            });
        });

        it('should return false without lint for bar.md', function (done) {
            var tests = [ {slugs: ['bar.md']}];
            var test_config = {};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory,  'bar.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_bad_uri(build_data, content);
                            expect(val).to.be.false;
                            expect(content.lint).not.to.include.keys('is_ignored_bad_uri');
                            done();
                        })

                    });
                });
            });
        });
    });

    describe('#get_is_ignored_extension()', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });
        it('should return true with lint for "foo.css"', function (done) {
            var tests = [ {slugs: ['foo.css']}];
            var test_config = {content_extensions: ['.md']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo.css');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_extension(build_data, content);
                            expect(val).to.be.true;
                            expect(content.lint).to.include.keys('is_ignored_extension');
                            done();
                        })

                    });
                });
            });
        });
        it('should return false without lint for "foo.md"', function (done) {
            var tests = [ {slugs: ['foo.md']}];
            var test_config = {content_extensions: ['.md']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_extension(build_data, content);
                            expect(val).to.be.false;
                            expect(content.lint).not.to.include.keys('is_ignored_extension');
                            done();
                        })

                    });
                });
            });
        });



    });

    describe('#get_is_ignored_conflicts_with_archive()', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });
        it('should return true with lint for updates/index.md when config.archives_directory = updates', function (done) {
            var tests = [ {slugs: ['updates', 'index.md']}];
            var test_config = {archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'updates', 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_conflicts_with_archive(build_data, content);
                            expect(build_data.config.archives_directory).to.equal('updates');
                            expect(atomic.get_uri(build_data, content)).to.equal('updates');
                            expect(val).to.be.true;
                            expect(content.lint).to.include.keys('is_ignored_conflicts_with_archive');
                            done();
                        })

                    });
                });
            });
        });
        it('should return false without lint for updates/foo.md when config.archives_directory = updates', function (done) {
            var tests = [ {slugs: ['updates', 'foo.md']}];
            var test_config = {archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'updates', 'foo.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_conflicts_with_archive(build_data, content);
                            expect(val).to.be.false;
                            expect(content.lint).not.to.include.keys('is_ignored_conflicts_with_archive');
                            done();
                        })

                    });
                });
            });
        });
        it('should return false without lint for updates/index.md when config.archives_directory = ""', function (done) {
            var tests = [ {slugs: ['updates', 'index.md']}];
            var test_config = {archives_directory: ''};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'updates', 'index.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_conflicts_with_archive(build_data, content);
                            expect(val).to.be.false;
                            expect(content.lint).not.to.include.keys('is_ignored_conflicts_with_archive');
                            done();
                        })

                    });
                });
            });
        });
        it('should return false without lint for "foo.md"', function (done) {
            var tests = [ {slugs: ['foo.md']}];
            var test_config = {content_extensions: ['.md']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var build_data = result;
                        var abs = path.join(build_data.content_directory, 'foo.md');
                        atomic.read(build_data, abs, function(err, content){
                            var val = atomic.get_is_ignored_conflicts_with_archive(build_data, content);
                            expect(val).to.be.false;
                            expect(content.lint).not.to.include.keys('is_ignored_conflicts_with_archive');
                            done();
                        })

                    });
                });
            });
        });



    });

    describe('#get_is_ignored_overridden_by_sibling()', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });
        it('should return true with lint for foo.html when foo.md exists', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo.html']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo.html'];
                        var val = atomic.get_is_ignored_overridden_by_sibling(result, content);
                        expect(val).to.be.true;
                        expect(content.lint).to.include.keys('is_ignored_overridden_by_sibling');
                        done();
                    });
                });
            });
        });
        it('should return false without lint for foo.html when foo.md does not exist', function (done) {
            var tests = [
                {slugs: ['foo.html']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo.html'];
                        var val = atomic.get_is_ignored_overridden_by_sibling(result, content);
                        expect(val).to.be.false;
                        expect(content.lint).not.to.include.keys('is_ignored_overridden_by_sibling');
                        done();
                    });
                });
            });
        });
        it('should return false without lint for foo.html when foo.md is not published', function (done) {
            var tests = [
                {slugs: ['foo.md'], meta: {published: false}},
                {slugs: ['foo.html']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo.html'];
                        var val = atomic.get_is_ignored_overridden_by_sibling(result, content);
                        expect(val).to.be.false;
                        expect(content.lint).not.to.include.keys('is_ignored_overridden_by_sibling');
                        done();
                    });
                });
            });
        });
        it('should return true without lint for foo.html when foo.md is not published but is_build_public = false', function (done) {
            var tests = [
                {slugs: ['foo.md'], meta: {published: false}},
                {slugs: ['foo.html']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, false, function(err, result){
                        var content = result.contents['foo.html'];
                        var val = atomic.get_is_ignored_overridden_by_sibling(result, content);
                        expect(val).to.be.true;
                        expect(content.lint).to.include.keys('is_ignored_overridden_by_sibling');
                        done();
                    });
                });
            });
        });
        it('should return false without lint  for foo.md  when foo.html exists', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo.html']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo.md'];
                        var val = atomic.get_is_ignored_overridden_by_sibling(result, content);
                        expect(val).to.be.false;
                        expect(content.lint).not.to.include.keys('is_ignored_overridden_by_sibling');
                        done();
                    });
                });
            });
        });
    });

    describe('#get_is_ignored_overridden_by_index()', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });
        it('should return true with lint for foo.md when foo/index.md exists', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'index.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo.md'];
                        var val = atomic.get_is_ignored_overridden_by_index(result, content);
                        expect(val).to.be.true;
                        expect(content.lint).to.include.keys('is_ignored_overridden_by_index');
                        done();
                    });
                });
            });
        });

        it('should return false without lint for foo.md when foo/index.md exists but is unpublished', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'index.md'], meta: {published: false}},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo.md'];
                        var val = atomic.get_is_ignored_overridden_by_index(result, content);
                        expect(val).to.be.false;
                        expect(content.lint).not.to.include.keys('is_ignored_overridden_by_index');
                        done();
                    });
                });
            });
        });

        it('should return true with lint for foo.md when foo/index.md exists but is unpublished but is_build_public = false', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'index.md'], meta: {published: false}},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, false, function(err, result){
                        var content = result.contents['foo.md'];
                        var val = atomic.get_is_ignored_overridden_by_index(result, content);
                        expect(val).to.be.true;
                        expect(content.lint).to.include.keys('is_ignored_overridden_by_index');
                        done();
                    });
                });
            });
        });

        it('should return false without lint for foo/index.md when foo.md exists', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'index.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo/index.md'];
                        var val = atomic.get_is_ignored_overridden_by_index(result, content);
                        expect(val).to.be.false;
                        expect(content.lint).not.to.include.keys('is_ignored_overridden_by_index');
                        done();
                    });
                });
            });
        });


    });

    describe('#get_parent()', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });
        it('should return foo.md as the parent of foo/bar.md', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_parent(result, content);
                        expect(val).to.equal(parent);
                        done();
                    });
                });
            });
        });
        it('should return foo/index.md as the parent of foo/bar.md', function (done) {
            var tests = [
                {slugs: ['foo', 'index.md']},
                {slugs: ['foo', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo/bar.md'];
                        var parent = result.contents['foo/index.md'];
                        var val = atomic.get_parent(result, content);
                        expect(val).to.equal(parent);
                        done();
                    });
                });
            });
        });
        it('should not return index.md as the parent of foo.md', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['index.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo.md'];
                        var parent = result.contents['index.md'];
                        var val = atomic.get_parent(result, content);
                        expect(val).not.to.equal(parent);
                        expect(val).to.be.null;
                        done();
                    });
                });
            });
        });

        it('should not return index.md as the parent of foo/index.md', function (done) {
            var tests = [
                {slugs: ['foo', 'index.md']},
                {slugs: ['index.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo/index.md'];
                        var parent = result.contents['index.md'];
                        var val = atomic.get_parent(result, content);
                        expect(val).not.to.equal(parent);
                        expect(val).to.be.null;
                        done();
                    });
                });
            });
        });

        it('should not return foo bar.md as the parent of foo bar/baz.md', function (done) {
            var tests = [
                {slugs: ['foo bar', 'baz.md']},
                {slugs: ['foo bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo bar/baz.md'];
                        var parent = result.contents['foo bar.md'];
                        var val = atomic.get_parent(result, content);
                        expect(val).not.to.equal(parent);
                        expect(val).to.be.null;
                        done();
                    });
                });
            });
        });

        it('should not return foo.css as the parent of foo/bar.md', function (done) {
            var tests = [
                {slugs: ['foo.css']},
                {slugs: ['foo', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.css'];
                        var val = atomic.get_parent(result, content);
                        expect(val).not.to.equal(parent);
                        expect(val).to.be.null;
                        done();
                    });
                });

            });
        });

        it('should not return updates.md as the parent of updates/bar.md', function (done) {
            var tests = [
                {slugs: ['updates.md']},
                {slugs: ['updates', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html'], archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['updates/bar.md'];
                        var parent = result.contents['updates.md'];
                        var val = atomic.get_parent(result, content);
                        expect(val).not.to.equal(parent);
                        expect(val).to.be.null;
                        done();
                    });
                });
            });
        });

        it('should not return foo.html as the parent of foo/bar.md if foo.md exists', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo.html']},
                {slugs: ['foo', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html'], archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.html'];
                        var val = atomic.get_parent(result, content);
                        expect(val).not.to.equal(parent);
                        expect(val).to.equal(result.contents['foo.md']);
                        done();
                    });
                });
            });
        });
        it('should not return foo.md as the parent of foo/bar.md if foo/index.md exists', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'index.md']},
                {slugs: ['foo', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html'], archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_parent(result, content);
                        expect(val).not.to.equal(parent);
                        expect(val).to.equal(result.contents['foo/index.md']);
                        done();
                    });
                });
            });
        });
        it('should not return foo.md as the parent of foo/bar.md if foo.md is not published', function (done) {
            var tests = [
                {slugs: ['foo.md'], meta: {published: false}},
                {slugs: ['foo', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html'], archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var content = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_parent(result, content);
                        expect(val).not.to.equal(parent);
                        expect(val).to.be.null;
                        done();
                    });
                });
            });
        });
        it('should return foo.md as the parent of foo/bar.md if foo.md is not published but is_build_public is false', function (done) {
            var tests = [
                {slugs: ['foo.md'], meta: {published: false}},
                {slugs: ['foo', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html'], archives_directory: 'updates'};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, false, function(err, result){
                        var content = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_parent(result, content);
                        expect(val).to.equal(parent);
                        done();
                    });
                });
            });
        });




    });

    describe('#get_children()', function(){
        var input_directory;

        before(function (done) {

            async.series(
                [
                    function (callback) {
                        temp.mkdir('nog-cli-test-', function (err, result) {
                            input_directory = result;
                            callback(err);
                        });
                    }
                ],
                function () {
                    done();
                }
            );


        });
        it('should return foo/bar.md as a child of foo.md', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var child = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_children(result, parent);
                        expect(val).to.contain(child);
                        done();
                    });
                });
            });
        });
        it('should not return foo/bar foo.md as a child of foo.md', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'bar foo.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var child = result.contents['foo/bar foo.md'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_children(result, parent);
                        expect(val).not.to.contain(child);
                        done();
                    });
                });
            });
        });

        it('should not return foo/bar.css as a child of foo.md', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'bar.css']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var child = result.contents['foo/bar.css'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_children(result, parent);
                        expect(val).not.to.contain(child);
                        done();
                    });
                });
            });
        });
        it('should not return foo/bar.html as a child of foo.md if foo/bar.md exists', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'bar.html']},
                {slugs: ['foo', 'bar.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var child = result.contents['foo/bar.html'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_children(result, parent);
                        expect(val).not.to.contain(child);
                        expect(val).to.contain(result.contents['foo/bar.md']);
                        done();
                    });
                });
            });
        });
        it('should not return foo/bar.md as a child of foo.md if foo/bar/index.md exists', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'bar.md']},
                {slugs: ['foo', 'bar', 'index.md']},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var child = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_children(result, parent);
                        expect(val).not.to.contain(child);
                        expect(val).to.contain(result.contents['foo/bar/index.md']);
                        done();
                    });
                });
            });
        });

        it('should not return foo/bar.md as a child of foo.md if foo/bar.md is not published', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'bar.md'], meta: {published: false}},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, true, function(err, result){
                        var child = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_children(result, parent);
                        expect(val).not.to.contain(child);
                        done();
                    });
                });
            });
        });
        it('should return foo/bar.md as a child of foo.md if foo/bar.md is not published but is_build_public = false', function (done) {
            var tests = [
                {slugs: ['foo.md']},
                {slugs: ['foo', 'bar.md'], meta: {published: false}},
            ];
            var test_config = {content_extensions: ['.md', '.html']};
            test_helpers.set_contents(input_directory, tests, function (err) {
                test_helpers.set_config(input_directory, test_config, function(err){
                    data.read(input_directory, false, function(err, result){
                        var child = result.contents['foo/bar.md'];
                        var parent = result.contents['foo.md'];
                        var val = atomic.get_children(result, parent);
                        expect(val).to.contain(child);
                        done();
                    });
                });
            });
        });





    });
});


