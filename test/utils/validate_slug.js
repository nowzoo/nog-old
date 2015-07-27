/* jshint expr: true */
/* jshint node: true */
var validate_slug = require('../../src/utils/validate_slug');
var expect = require('chai').expect;
var _ = require('lodash');

describe('#utils/validate_slug()', function() {

    it('should return false for invalid slugs', function () {
        var slugs = ['', null, false, true, undefined, 0, 1, -1, 'A', '1A', '-', '-aa-foo', 'électric', 'foo-a-', ' ', 'foo bar', 'foo--bar', 'FOO BAR', 'foo-bar ', '\nfoo-bar'];
        _.each(slugs, function (slug) {
            var val = validate_slug(slug);
            expect(val).to.be.false;
        });
    });

    it('should return true for valid slugs', function () {
        var slugs = ['foo', 'bar4', '4bar', 'foo-bar', 'foo-bar-baz-8'];
        _.each(slugs, function (slug) {
            var val = validate_slug(slug);
            expect(val).to.be.true;
        });
    });
});
