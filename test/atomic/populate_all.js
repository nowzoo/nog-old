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
var read_site = require('../../src/site_json/read');
var populate_all = require('../../src/atomic/populate_all');

var test_helpers = require('../test_helpers');


var default_render_markdown = require('../../src/render/markdown');

describe('#atomic/populate_all()', function(){


    var input_directory;
    var build;
    var contents;
    var site;
    var tests = [
        {slugs: ['index.md']},
        {slugs: ['bar.md']}
    ];
    before(function(done){

        async.series(
            [
                function(callback){
                    temp.mkdir('nog-cli-test-', function(err, result){
                        input_directory = result;
                        build = {
                            input_directory: input_directory,
                            public: true,
                            published_only: true
                        };
                        callback(err);
                    });
                },
                function(callback){
                    test_helpers.set_contents(input_directory, tests, function(){
                        read_all(build, function(err, result){
                            contents = result;
                            callback(err);
                        });
                    })
                },
                function(callback){
                    read_site(build, function(err, result){
                        site = result;
                        site.render_markdown = default_render_markdown;
                        callback(err);
                    })
                }
            ],
            function(){
                done();
            }
        );



    });

    it('should callback with no error', function(done){
        populate_all(build, site, contents, function(err){
            expect(err).to.be.null;
            done();
        })

    });



});
