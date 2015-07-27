/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var moment = require('moment');

var get_year_archives_id = require('../../src/archives/get_year_archives_id');


describe('#archives/get_year_archives_id()', function() {


    it('should return "posts/2014" for a date 2014/12/22, when the site.prefix is empty', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var d = moment('2014/12/22', 'YYYY/MM/DD');
        expect(get_year_archives_id(site, d)).to.equal('posts/2014');
    });

    it('should return "posts/2014" for a date 2014/12/22, when the site.prefix is not empty', function () {
        var site = {prefix:'foo', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var d = moment('2014/12/22', 'YYYY/MM/DD');
        expect(get_year_archives_id(site, d, 0)).to.equal('posts/2014');
    });


});


