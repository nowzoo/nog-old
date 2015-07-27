/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var async = require('async');
var fs = require('fs-extra');
var temp = require('temp').track();

var copy_assets = require('../../src/build/copy_assets');

var test_helpers = require('../test_helpers');

describe('#build/copy_assets()', function() {


    var input_directory;
    var output_directory;
    var build = {};
    before(function(done){

        async.series(
            [
                function(callback){
                    temp.mkdir('nog-cli-test-', function(err, result){
                        input_directory = result;
                        build.input_directory = input_directory;
                        callback(err);
                    });
                },
                function(callback){
                    temp.mkdir('nog-cli-test-', function(err, result){
                        output_directory = result;
                        build.output_directory = output_directory;
                        callback(err);
                    });
                }
            ],
            function(){
                done();
            }
        );
    });

    it('should correctly copy a file from the input dir to the output dir', function(done){
        var tests = [
            ['css', 'style.css']
        ];
        var build = {public: true, input_directory: input_directory, output_directory: output_directory};
        var site = {prefix: '', assets_copy_to_subdir: false};
        var changed_uris = [];
        test_helpers.set_assets(input_directory, tests,function(){
            copy_assets(build, site, changed_uris, function(err){
                expect(err).to.be.null;
                var p = path.join(output_directory, tests[0].join(path.sep));
                fs.exists(p, function(exists){
                    expect(exists).to.be.true;
                    done();
                })

            })
        });
    });

});

