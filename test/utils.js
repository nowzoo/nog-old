/* jshint expr: true */
/* jshint node: true */
var utils = require('../src/utils');
var expect = require('chai').expect;
var _ = require('lodash');

var fs = require('fs');
var path = require('path');
var temp = require('temp').track();

describe('utils', function(){
    describe('#validate_slug()', function() {

        it('should return false for invalid slugs', function () {
            var slugs = ['', null, false, true, undefined, 0, 1, -1, 'A', '1A', '-', '-aa-foo', 'électric', 'foo-a-', ' ', 'foo bar', 'foo--bar', 'FOO BAR', 'foo-bar ', '\nfoo-bar'];
            _.each(slugs, function (slug) {
                var val = utils.validate_slug(slug);
                expect(val).to.be.false;
            });
        });

        it('should return true for valid slugs', function () {
            var slugs = ['foo', 'bar4', '4bar', 'foo-bar', 'foo-bar-baz-8'];
            _.each(slugs, function (slug) {
                var val = utils.validate_slug(slug);
                expect(val).to.be.true;
            });
        });
    });


});
