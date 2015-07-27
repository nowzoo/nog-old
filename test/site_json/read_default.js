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

var read_default = require('../../src/site_json/read_default');


describe('#site_json/read_default()', function(){

    it('should callback with an object', function(done){
        read_default(function(err, result){
            expect(err).to.be.null;
            expect(result).to.be.an('object');
            expect(result.title).to.equal('Nog');
            done();
        })
    });

});


