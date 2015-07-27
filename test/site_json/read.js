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

var read = require('../../src/site_json/read');

var test_helpers = require('../test_helpers');



describe('#site_json/read()', function(){
    var input_directory;
    var build;
    before(function(done){
        async.series(
            [
                function(callback){
                    temp.mkdir('nog-test-', function(err, result){
                        input_directory = result;
                        build = {input_directory: input_directory};
                        callback(err);
                    });
                }
            ], done
        );

    });
    afterEach(function(done){
        fs.remove(path.join(input_directory, '_cfg'), done);
    });
    it('should callback with no error and an object for a valid file', function(done){
        test_helpers.set_config(input_directory, {title: 'foo'}, function(){
            read(build, function(err, result){
                expect(err).to.be.null;
                expect(result).to.be.an('object');
                expect(result.title).to.equal('foo');
                done();
            });
        });

    });
    it('should callback with an error and an object if the user\'s site.json does not exist', function(done){
        read(build, function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.be.an('object');
            expect(result.title).to.equal('Nog');
            done();
        });

    });
    it('should callback with an error and an object if the user\'s site.json does not contain a plain object', function(done){
        test_helpers.set_config(input_directory, '[]', function(){
            read(build, function(err, result){
                expect(err).to.be.an('error');
                expect(result).to.be.an('object');
                expect(result.title).to.equal('Nog');
                done();
            });
        });

    });

    it('should callback with an error and an object if the user\'s site.json is not valid JSON', function(done){
        test_helpers.set_config(input_directory, 'foo bar', function(){
            read(build, function(err, result){
                expect(err).to.be.an('error');
                expect(result).to.be.an('object');
                expect(result.title).to.equal('Nog');
                done();
            });
        }, true);

    });
    it('should callback with an error and an object if the user\'s site.json is empty', function(done){
        test_helpers.set_config(input_directory, '', function(){
            read(build, function(err, result){
                expect(err).to.be.an('error');
                expect(result).to.be.an('object');
                expect(result.title).to.equal('Nog');
                done();
            });
        }, true);

    });

    it('should callback with an error and an object if the user\'s site.json has some invalid values', function(done){
        test_helpers.set_config(input_directory, {title: 'Foo', excerpt_length: 'invalid'} , function(){
            read(build, function(err, result){
                expect(err).to.be.an('error');
                expect(result).to.be.an('object');
                expect(result.title).to.equal('Foo');
                expect(err.lint).to.include.keys('excerpt_length');
                done();
            });
        });

    });

});


