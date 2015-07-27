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

var clear_require_cache = require('../../src/pluggable/clear_require_cache');

var test_helpers = require('../test_helpers');



describe('#pluggable/clear_require_cache()', function(){
    var input_directory;
    before(function(done){
        async.series(
            [
                function(callback){
                    temp.mkdir('nog-test-', function(err, result){
                        input_directory = result;
                        callback(err);
                    });
                }
            ], done
        );

    });
    it('should clear the require cache for files that have changed in _cfg', function(done){
        var test_one = 'module.exports = \'Foo Bar\';';
        var test_two = 'module.exports = \'Bar Foo\';';
        var p = path.join(input_directory, '_cfg', 'test.js');
        var rp = path.join(path.dirname(p), path.basename(p, path.extname(p)));
        fs.outputFile(p, test_one, function(){
            var result = require(rp);
            var build = {input_directory: input_directory};
            expect(result).to.equal('Foo Bar');

            clear_require_cache(build, function(err){
                expect(err).to.be.null;
                fs.outputFile(p, test_two, function(){
                    result = require(rp);
                    expect(result).to.equal('Bar Foo');
                    done();
                })
            })
        });

    });


});
