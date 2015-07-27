/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;

var get_title = require('../../src/atomic/get_title');


describe('#atomic/get_title()', function() {


    it('should return the humanized basename if content.meta.title does not exist', function () {
        var content = {meta: {}, relative_path: 'foo-bar.md'};
        expect(get_title(content)).to.equal('Foo bar');
    });
    it('should return the humanized basename if content.meta.title is other than a string', function () {
        var content = {meta: {title: /fff/}, relative_path: 'foo-bar.md'};
        expect(get_title(content)).to.equal('Foo bar');
    });
    it('should return the humanized basename if content.meta.title is an empty string', function () {
        var content = {meta: {title: '    '}, relative_path: 'foo-bar.md'};
        expect(get_title(content)).to.equal('Foo bar');
    });
    it('should return the trimmed value if content.meta.title is a non-empty string', function () {
        var content = {meta: {title: ' Hey You    '}, relative_path: 'foo-bar.md'};
        expect(get_title(content)).to.equal('Hey You');

    });

});


