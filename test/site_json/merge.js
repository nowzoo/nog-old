/* jshint expr: true */
/* jshint node: true */

var expect = require('chai').expect;
var fs = require('fs-extra');
var S = require('string');
var _ = require('lodash');
var moment = require('moment');
var path = require('path');
var temp = require('temp').track();

var test_helpers = require('../test_helpers');
var merge = require('../../src/site_json/merge');

describe('#site_json/merge()', function(){
    var defaults;
    before(function(done){
        fs.readJSON(path.join(path.dirname(path.dirname(__dirname)),  '_cfg', 'site.json'), function(err, result){
            defaults = result;
            done(err);
        });
    });



    _.each(['title', 'tagline', 'archives_tag_title_format', 'archives_title'], function(key){
        it('should set config.' + key +  ' to the default if it is not passed, with no lint', function () {

            var cfg;
            var lint;
            lint = {};
            cfg = merge(defaults, {}, lint);
            expect(cfg[key]).to.equal(defaults[key]);
            expect(lint).not.to.include.keys(key);
        });

        it('should set config.' + key +  ' to the default if the passed value is not a string, with lint', function () {
            var tests = [true, false,/ff/,[],{}, null, undefined, new Date()];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(defaults[key]);
                expect(lint).to.include.keys(key);
            });
        });

        it('should set config.' + key +  ' to the default if the passed value is an empty string, with lint', function () {
            var tests = ['   ', ''];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(defaults[key]);
                expect(lint).to.include.keys(key);
            });
        });


        it('should set config.' + key +  ' to the trimmed value if it is a valid non-empty string, with no lint', function () {
            var tests = ['Y', 'M', ' MMMM '];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(val.trim());
                expect(lint).not.to.include.keys(key);
            });
        });
    });

    _.each(['year', 'month', 'day'], function(date_key){
        _.each(['title', 'slug', 'name'], function(purpose_key){
            var key = 'archives_' + date_key + '_' + purpose_key + '_format';
            it('should set config.' + key +  ' to the default if it is not passed, with no lint', function () {

                var cfg;
                var lint;
                lint = {};
                cfg = merge(defaults, {}, lint);
                expect(cfg[key]).to.equal(defaults[key]);
                expect(lint).not.to.include.keys(key);
            });

            it('should set config.' + key +  ' to the default if the passed value is not a string, with lint', function () {
                var tests = [true, false,/ff/,[],{}, null, undefined, new Date()];
                var cfg;
                var lint;
                var my_cfg;
                _.each(tests, function(val){
                    lint = {};
                    my_cfg = {};
                    my_cfg[key] = val;
                    cfg = merge(defaults, my_cfg, lint);
                    expect(cfg[key]).to.equal(defaults[key]);
                    expect(lint).to.include.keys(key);
                });
            });

            it('should set config.' + key +  ' to the default if the passed value is an empty string, with lint', function () {
                var tests = ['   ', ''];
                var cfg;
                var lint;
                var my_cfg;
                _.each(tests, function(val){
                    lint = {};
                    my_cfg = {};
                    my_cfg[key] = val;
                    cfg = merge(defaults, my_cfg, lint);
                    expect(cfg[key]).to.equal(defaults[key]);
                    expect(lint).to.include.keys(key);
                });
            });


            it('should set config.' + key +  ' to the trimmed value if it is a valid non-empty string, with no lint', function () {
                var tests = ['Y', 'M', ' MMMM '];
                var cfg;
                var lint;
                var my_cfg;
                _.each(tests, function(val){
                    lint = {};
                    my_cfg = {};
                    my_cfg[key] = val;
                    cfg = merge(defaults, my_cfg, lint);
                    expect(cfg[key]).to.equal(val.trim());
                    expect(lint).not.to.include.keys(key);
                });
            });
        });
    });

    //optional booleans
    _.each(['archives_generate_dates', 'archives_generate_tags', 'assets_copy_to_subdir'], function(key){
        it('should set config.' + key +  ' to the default if it is not passed, with no lint', function () {

            var cfg;
            var lint;
            lint = {};
            cfg = merge(defaults, {}, lint);
            expect(cfg[key]).to.equal(defaults[key]);
            expect(lint).not.to.include.keys(key);
        });

        it('should set config.' + key +  ' to the default if the passed value is not a boolean, with lint', function () {
            var tests = [/ff/,[],{}, null, undefined, new Date()];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(defaults[key]);
                expect(lint).to.include.keys(key);
            });
        });

        it('should set config.' + key +  ' to the passed value if it is a boolean, without lint', function () {
            var tests = [true, false];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(val);
                expect(lint).not.to.include.keys(key);
            });
        });
    });
    it('should set config.archives_directory to "" if an empty string is passed passed, with no lint', function () {

        var cfg;
        var lint;
        lint = {};
        cfg = merge(defaults, {archives_directory: '   '}, lint);
        expect(cfg.archives_directory).to.equal('');
        expect(lint).not.to.include.keys('archives_directory');
    });

    //optional strings that should be slugs...
    _.each(['archives_tag_slug', 'archives_page_slug', 'archives_directory'], function(key){
        it('should set config.' + key +  ' to the default if it is not passed, with no lint', function () {

            var cfg;
            var lint;
            lint = {};
            cfg = merge(defaults, {}, lint);
            expect(cfg[key]).to.equal(defaults[key]);
            expect(lint).not.to.include.keys(key);
        });
        it('should set config.' + key +  ' to the default if the passed value is not a string, with lint', function () {
            var tests = [true, false,/ff/,[],{}, null, undefined, new Date()];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(defaults[key]);
                expect(lint).to.include.keys(key);
            });
        });

        it('should set config.' + key +  ' to the default if the passed value is not a valid slug, with lint', function () {
            var tests = ['AAA', 'foo bar', 'foo_bar', '-aaa'];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(defaults[key]);
                expect(lint).to.include.keys(key);
            });
        });

        it('should set config.' + key +  ' to the value if the passed value is a valid slug, without lint', function () {
            var tests = ['aaa', 'foo-bar'];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(val);
                expect(lint).not.to.include.keys(key);
            });
        });
    });

    _.each(['excerpt_length', 'archives_posts_per_page'], function(key){
        it('should set config.' + key +  ' to the default if it is not passed, with no lint', function () {

            var cfg;
            var lint;
            lint = {};
            cfg = merge(defaults, {}, lint);
            expect(cfg[key]).to.equal(defaults[key]);
            expect(lint).not.to.include.keys(key);
        });
        it('should set config.' + key +  ' to the default if the passed value is not a parseable number, with lint', function () {
            var tests = [true, false,/ff/,[],{}, null, undefined, new Date(), 'ffooo'];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(defaults[key]);
                expect(lint).to.include.keys(key);
            });
        });
        it('should set config.' + key +  ' to the default if the passed value is less than 0, with lint', function () {
            var tests = [-1, '-1'];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(defaults[key]);
                expect(lint).to.include.keys(key);
            });
        });
        it('should set config.' + key +  ' to the value if the passed value is a number greater than 0, without lint', function () {
            var tests = [0,22, '22'];
            var cfg;
            var lint;
            var my_cfg;
            _.each(tests, function(val){
                lint = {};
                my_cfg = {};
                my_cfg[key] = val;
                cfg = merge(defaults, my_cfg, lint);
                expect(cfg[key]).to.equal(parseInt(val));
                expect(lint).not.to.include.keys(key);
            });
        });
    });
    it('should set config.url to the default if it is not passed, with no lint', function () {

        var cfg;
        var lint;
        lint = {};
        cfg = merge(defaults, {}, lint);
        expect(cfg.url).to.equal(defaults.url);
        expect(lint).not.to.include.keys('url');
    });
    it('should set config.url to the default if url if the passed value is not a string, with lint, with no lint', function () {

        var tests = [true, false,/ff/,[],{}, null, undefined, new Date()];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.url = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.url).to.equal(defaults.url);
            expect(lint).to.include.keys('url');
        });
    });
    it('should set config.url to the default if url  does not begin with http:// or https://', function () {

        var tests = ['foo','http/foo'];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.url = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.url).to.equal(defaults.url);
            expect(lint).to.include.keys('url');
        });
    });

    it('should set config.url to the value if the passed value begins with http:// or https://', function () {

        var tests = ['http://foo.com','https://foo.com'];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.url = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.url).to.equal(val);
            expect(lint).not.to.include.keys('url');
        });
    });

    it('should set config.prefix to the default if it is not passed, with no lint', function () {

        var cfg;
        var lint;
        lint = {};
        cfg = merge(defaults, {}, lint);
        expect(cfg.prefix).to.equal(defaults.prefix);
        expect(lint).not.to.include.keys('prefix');
    });

    it('should set config.prefix to the default if it is not a string, with lint', function () {

        var tests = [true, false,/ff/,[],{}, null, undefined, new Date()];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.prefix = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.prefix).to.equal(defaults.prefix);
            expect(lint).to.include.keys('prefix');
        });
    });

    it('should set config.prefix to the default if it contains a / in the middle, with lint', function () {

        var tests = ['foo/bar', '/foo/bar'];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.prefix = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.prefix).to.equal(defaults.prefix);
            expect(lint).to.include.keys('prefix');
        });
    });

    it('should set config.url to the value if it is valid', function () {

        var tests = ['foo','bar'];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.prefix = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.prefix).to.equal(val);
            expect(lint).not.to.include.keys('prefix');
        });
    });
    it('should trim leading and trailing slashes from config.url', function () {

        var tests = ['/foo','foo/', '/foo/'];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.prefix = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.prefix).to.equal('foo');
            expect(lint).not.to.include.keys('prefix');
        });
    });


    it('should set config.content_extensions to the default if it is not passed, with no lint', function () {

        var cfg;
        var lint;
        lint = {};
        cfg = merge(defaults, {}, lint);
        expect(cfg.content_extensions).to.deep.equal(defaults.content_extensions);
        expect(lint).not.to.include.keys('content_extensions');
    });

    it('should set config.content_extensions to the default if it is not an array, with lint', function () {

        var tests = [true, false,/ff/,{}, null, undefined, new Date()];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.content_extensions = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.content_extensions).to.equal(defaults.content_extensions);
            expect(lint).to.include.keys('content_extensions');
        });
    });
    it('should set config.content_extensions to the default if the array contains invalid extensions, with lint', function () {

        var tests = [['foo', '.md']];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.content_extensions = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.content_extensions).to.equal(defaults.content_extensions);
            expect(lint).to.include.keys('content_extensions');
        });
    });
    it('should set config.content_extensions to the value if the array contains all valid extensions, with no lint', function () {

        var tests = [['.foo', '.md']];
        var cfg;
        var lint;
        var my_cfg;
        _.each(tests, function(val){
            lint = {};
            my_cfg = {};
            my_cfg.content_extensions = val;
            cfg = merge(defaults, my_cfg, lint);
            expect(cfg.content_extensions).to.equal(val);
            expect(lint).not.to.include.keys('content_extensions');
        });
    });



});
