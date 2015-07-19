/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var _ = require('lodash');

var fs = require('fs-extra');
var path = require('path');
var temp = require('temp').track();

var data = require('../data');

var test_helpers = require('./test_helpers');



describe('data', function() {
    describe('#read()', function () {
        var input_directory;
        before(function(done){
            temp.mkdir('nog-cli-test-', function(err, result){
                input_directory = result;
                done();
            });
        });
        it('should callback with an object', function (done) {
            data.read(input_directory, true, function (err, result) {
                expect(result).to.be.an('object');
                done();
            })
        });
        it('should set data.input_directory to the value passed', function (done) {
            data.read(input_directory, true, function (err, result) {
                expect(result.input_directory).to.equal(input_directory);
                done();
            })
        });
        it('should set data.is_build_public to true passed if passed true', function (done) {
            data.read(input_directory, true, function (err, result) {
                expect(result.is_build_public).to.equal(true);
                done();
            })
        });
        it('should set data.is_build_public to false passed if passed false', function (done) {
            data.read(input_directory, false, function (err, result) {
                expect(result.is_build_public).to.equal(false);
                done();
            })
        });
        it('should set data.templates as an object', function (done) {
            data.read(input_directory, false, function (err, result) {
                expect(result.templates).to.be.an('object');
                done();
            })
        });
        it('should set data.templates.user as an object', function (done) {
            data.read(input_directory, false, function (err, result) {
                expect(result.templates.user).to.be.an('object');
                done();
            })
        });
        it('should set data.templates.defaults as an object', function (done) {
            data.read(input_directory, false, function (err, result) {
                expect(result.templates.defaults).to.be.an('object');
                expect(result.templates.defaults).to.include.keys(['archive.twig', 'index.twig', 'main.twig', 'page.twig', 'post.twig']);
                done();
            })
        });
        it('should set data.config as an object', function (done) {
            data.read(input_directory, false, function (err, result) {
                expect(result.config).to.be.an('object');
                done();
            })
        });


    });

});



