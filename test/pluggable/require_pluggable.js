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

var require_pluggable = require('../../src/pluggable/require_pluggable');

var test_helpers = require('../test_helpers');



describe('#pluggable/require_pluggable()', function(){
    var input_directory;
    var build;
    beforeEach(function(done){
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
    it('should read a valid file without an error', function(done){
        var test = 'module.exports = {};';
        var p = path.join(input_directory, '_cfg', 'pluggable.js');

        fs.outputFile(p, test, function(){
            require_pluggable(build, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.be.an('object');
                done();
            });
        });

    });



    it('should callback with an object but without an error if the file does not exist', function(done){

        require_pluggable(build, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.be.an('object');

            done();
        });

    });

    it('should callback with an error but an empty object if the file is invalid js', function(done){
        var test = 'mook';
        var p = path.join(input_directory, '_cfg', 'pluggable.js');
        fs.outputFile(p, test, function(){
            require_pluggable(build, function (err, result) {
                expect(err).to.be.an('error');
                expect(result).to.be.an('object');
                done();
            });
        });

    });

    it('should callback with no error and an empty object if the file is empty', function(done){
        var test = '   ';
        var p = path.join(input_directory, '_cfg', 'pluggable.js');
        fs.outputFile(p, test, function(){

            require_pluggable(build, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.be.an('object');
                done();
            });
        });

    });


});
