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

var read_all = require('../../src/atomic/read_all');

var test_helpers = require('../test_helpers');



describe('#atomic/read_all()', function(){


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

    it('should callback without an error and with an object', function(done){
        var tests = [
            {slugs: ['index.md']},
            {slugs: ['foo', 'index.md']}
        ];
        test_helpers.set_contents(input_directory, tests, function(){
            read_all(build, function(err, result){
                expect(err).to.be.null;
                expect(result).to.be.an('object');
                expect(result).to.include.keys('index.md');
                expect(result).to.include.keys(path.join('foo', 'index.md'));
                done();
            });
        })

    });


});


