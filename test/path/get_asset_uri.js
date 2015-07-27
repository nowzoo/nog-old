/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');

var get_asset_uri = require('../../src/path/get_asset_uri');


describe('#path/get_asset_uri()', function() {


    it('should return "style.css" for _assets/style.css when build.public=true, site.prefix="" and site.assets_copy_to_subdir=false', function(){
        var build = {public: true, input_directory: process.cwd()};
        var site = {prefix: '', assets_copy_to_subdir: false};
        var test = path.join(build.input_directory, '_assets', 'style.css');
        var result = get_asset_uri(build, site, test);
        expect(result).to.equal('style.css');

    });

    it('should return "foo/style.css" for _assets/style.css when build.public=true, site.prefix="" and site.assets_copy_to_subdir="foo"', function(){
        var build = {public: true, input_directory: process.cwd()};
        var site = {prefix: '', assets_copy_to_subdir: 'foo'};
        var test = path.join(build.input_directory, '_assets', 'style.css');
        var result = get_asset_uri(build, site, test);
        expect(result).to.equal('foo/style.css');

    });

    it('should return "foo/style.css" for _assets/style.css when build.public=false, site.prefix="" and site.assets_copy_to_subdir="foo"', function(){
        var build = {public: false, input_directory: process.cwd()};
        var site = {prefix: '', assets_copy_to_subdir: 'foo'};
        var test = path.join(build.input_directory, '_assets', 'style.css');
        var result = get_asset_uri(build, site, test);
        expect(result).to.equal('foo/style.css');

    });

    it('should return "bar/foo/style.css" for _assets/style.css when build.public=false, site.prefix="bar" and site.assets_copy_to_subdir="foo"', function(){
        var build = {public: false, input_directory: process.cwd()};
        var site = {prefix: 'bar', assets_copy_to_subdir: 'foo'};
        var test = path.join(build.input_directory, '_assets', 'style.css');
        var result = get_asset_uri(build, site, test);
        expect(result).to.equal('bar/foo/style.css');

    });

});

