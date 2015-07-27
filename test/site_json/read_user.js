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

var read_user = require('../../src/site_json/read_user');

var test_helpers = require('../test_helpers');



describe('#site_json/read_user()', function(){
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
    it('should callback with no err and an object if the user file exists and is valid', function(done){
        test_helpers.set_config(input_directory, {title: 'foo'}, function(){
            read_user(build, function(err, result){
                expect(err).to.be.null;
                expect(result).to.be.an('object');
                expect(result.title).to.equal('foo');
                done();
            });
        });

    });
    it('should callback with an error and an empty object if the file does not exist', function(done){
        var lint = {};
        read_user(build, function(err, result){
            expect(err).to.be.an('error');
            expect(result).to.be.an('object');
            expect(_.size(result)).to.equal(0);
            done();
        });

    });
    it('should callback with an error and an empty object if the file does not contain a plain object', function(done){
        test_helpers.set_config(input_directory, '[]', function(){
            read_user(build, function(err, result){
                expect(err).to.be.an('error');
                expect(result).to.be.an('object');
                expect(_.size(result)).to.equal(0);
                done();
            });
        });

    });
    it('should callback with an error and an empty object if the file is empty', function(done){
        test_helpers.set_config(input_directory, '  ', function(){
            read_user(build, function(err, result){
                expect(err).to.be.an('error');
                expect(result).to.be.an('object');
                expect(_.size(result)).to.equal(0);
                done();
            });
        });

    });

});


