/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var moment = require('moment');

var get_month_archives_uri = require('../../src/archives/get_month_archives_uri');


describe('#archives/get_month_archives_uri()', function() {


    it('should return "posts/2014/12" for a date 2014/12/22, not being passed a page', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var d = moment('2014/12/22', 'YYYY/MM/DD');
        expect(get_month_archives_uri(site, d)).to.equal('posts/2014/12');
    });

    it('should return "posts/2014/12" for a date 2014/12/22, being passed a page = 0', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var d = moment('2014/12/22', 'YYYY/MM/DD');
        expect(get_month_archives_uri(site, d, 0)).to.equal('posts/2014/12');
    });
    it('should return "posts/2014/12/p/2" for a date 2014/12/22, being passed a page = 1', function () {
        var site = {prefix:'', archives_directory: 'posts', archives_tag_slug: 'tagged', archives_page_slug: 'p'};
        var d = moment('2014/12/22', 'YYYY/MM/DD');
        expect(get_month_archives_uri(site, d, 1)).to.equal('posts/2014/12/p/2');
    });



});


