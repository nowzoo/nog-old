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

var read = require('../../src/atomic/read');

var test_helpers = require('../test_helpers');



describe('#atomic/read()', function(){


    var input_directory;
    var build;
    before(function(done){

        async.series(
            [
                function(callback){
                    temp.mkdir('nog-cli-test-', function(err, result){
                        input_directory = result;
                        build = {input_directory: input_directory};
                        callback(err);
                    });
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
            read(build, path.join(input_directory, '_content', 'index.html'), function(err, result){
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
            read(build, path.join(input_directory, '_content', 'index.md'), function(err, result){
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
            read(build, absolute_path, function(err, result){
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
            read(build, absolute_path, function(err, result){
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
            read(build, absolute_path, function(err, result){
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
            read(build, absolute_path, function(err, result){
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
            read(build, absolute_path, function(err, result){
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
            read(build, absolute_path, function(err, result){
                expect(result.relative_path).to.equal('index.md');
                done();
            });
        })

    });

});


