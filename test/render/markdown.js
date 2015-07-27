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

var markdown_render = require('../../src/render/markdown');

var test_helpers = require('../test_helpers');


describe('#markdown_render()', function(){

    it('should callback with an error if passed a something other than a string', function(done){
        markdown_render(/ff/, function(err){
            expect(err).to.be.an('error');
            done();
        });
    });

    it('should callback with a rendered html', function(done){
        markdown_render('foo bar', function(err, result){
            expect(err).to.be.null;
            expect(result).to.equal('<p>foo bar</p>\n');
            done();
        });
    });

    it('should callback with a highlighted code blocks', function(done){
        markdown_render('```\nvar foo;\n```', function(err, result){
            expect(err).to.be.null;
            expect(result).to.contain('hljs-keyword');
            done();
        });
    });


});


