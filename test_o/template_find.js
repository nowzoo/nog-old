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

var template_find = require('../src/template_find');

var test_helpers = require('./test_helpers');


describe('#template_find()', function(){
    var build_data = {};
    var tests = [['post.twig'], ['page.twig'], ['foo', 'custom.jade']];
    before(function(done){
        async.series(
            [
                function(callback){
                    temp.mkdir('nog-test-', function(err, result){
                        build_data.input_directory = result;
                        callback(err);
                    });
                },
                function(callback){
                    test_helpers.set_templates(build_data.input_directory, tests, callback)
                }
            ], done
        );

    });
    it('should callback with an error if passed a template name that does not exist', function(done){
        template_find(build_data, 'foo.twig', function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.be.null;
            done();
        })
    });
    it('should callback with no error if passed a template name that does exist', function(done){
        template_find(build_data, 'post.twig', function(err, result){
            expect(err).to.be.null;
            expect(result).to.be.a('string');
            done();
        })
    });
    it('should callback with an absolute path', function(done){
        template_find(build_data, 'post.twig', function(err, result){
            expect(path.isAbsolute(result)).to.be.true;
            done();
        })
    });
    it('should handle paths that are in subdirectories', function(done){
        template_find(build_data, 'foo/custom.jade', function(err, result){
            expect(err).to.be.null;
            expect(path.isAbsolute(result)).to.be.true;
            done();
        })
    });
    it('should callback with an error if given a windows style path', function(done){
        template_find(build_data, 'foo\\custom.jade', function(err, result){
            expect(err).to.be.an('error');
            done();
        })
    });

});


