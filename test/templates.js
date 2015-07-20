/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var _ = require('lodash');

var fs = require('fs-extra');
var path = require('path');
var temp = require('temp').track();

var templates = require('../src/templates');

var test_helpers = require('./test_helpers');



describe('templates', function() {
    describe('#read()', function () {
        var input_directory;
        before(function(done){
            temp.mkdir('nog-cli-test-', function(err, result){
                input_directory = result;
                done();
            });
        });
        it('should callback with an object', function (done) {
            templates.read(input_directory, function (err, result) {
                expect(result).to.be.an('object');
                done();
            })
        });

        it('should set data.user as an object', function (done) {
            templates.read(input_directory, function (err, result) {
                expect(result.user).to.be.an('object');
                done();
            })
        });
        it('should set data.defaults as an object', function (done) {
            templates.read(input_directory, function (err, result) {
                expect(result.defaults).to.be.an('object');
                expect(result.defaults).to.include.keys(['archive.twig', 'index.twig', 'main.twig', 'page.twig', 'post.twig']);
                done();
            })
        });



    });

    describe('#read_template_directory()', function () {
        var input_directory;
        var template_directory;
        before(function(done){
            temp.mkdir('nog-cli-test-', function(err, result){
                input_directory = result;
                template_directory = path.join(input_directory, '_templates');
                done();
            });
        });
        it('should callback with an empty object if the _templates dir does not exist', function (done) {
            templates.read_template_directory(template_directory, function (err, result) {
                expect(result).to.be.an('object');
                expect(_.size(result)).to.equal(0);
                done();
            })
        });
        it('should callback with an empty object if the _templates dir is empty', function (done) {
            test_helpers.set_templates(input_directory, [], function () {
                templates.read_template_directory(template_directory, function (err, result) {
                    expect(result).to.be.an('object');
                    expect(_.size(result)).to.equal(0);
                    done();
                })
            });
        });
        it('should set a key and value for each file, with the key being the relative path and the value being the absolute path', function (done) {
            var tests = [['post.twig'], ['foo', 'bar.twig']];
            test_helpers.set_templates(input_directory, tests, function () {
                templates.read_template_directory(template_directory, function (err, result) {
                    expect(result).to.be.an('object');
                    expect(_.size(result)).to.equal(tests.length);
                    _.each(tests, function(arr){
                        var key = arr.join(path.sep);
                        expect(result).to.include.keys(key);
                        expect(path.isAbsolute(result[key])).to.be.true;
                    });
                    done();
                })
            });
        });
        it('should read the defaults/_templates directory correctly', function (done) {
            templates.read_template_directory(path.join(process.cwd(), 'defaults', '_templates'), function (err, result) {
                expect(result).to.be.an('object');
                expect(result).to.include.keys(['archive.twig', 'index.twig', 'main.twig', 'page.twig', 'post.twig']);
                _.each(result, function(p){
                    expect(path.isAbsolute(p)).to.be.true;
                });
                done();
            })
        });



    });





});



