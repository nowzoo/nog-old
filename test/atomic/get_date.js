/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var moment = require('moment');

var get_date = require('../../src/atomic/get_date');


describe('#atomic/get_date()', function() {


    it('should return an error and the stat.mtime if content.meta.date does not exist', function () {
        var dstr = '2014/12/22 13:56';
        var date = moment(dstr, 'YYYY/MM/DD HH:mm');
        var content = {meta: {},  relative_path: 'foo-bar.md', stat: {mtime: date}};
        var val = get_date(content);
        expect(val.valueOf()).to.equal(date.valueOf());
    });

    it('should return an error and the stat.mtime if content.meta.date is an empty string', function () {
        var dstr = '2014/12/22 13:56';
        var date = moment(dstr, 'YYYY/MM/DD HH:mm');
        var content = {meta: {date: '   '},  relative_path: 'foo-bar.md', stat: {mtime: date}};
        var val = get_date(content);
        expect(val.valueOf()).to.equal(date.valueOf());

    });

    it('should return an error and the stat.mtime if content.meta.date other than a string', function () {
        var dstr = '2014/12/22 13:56';
        var date = moment(dstr, 'YYYY/MM/DD HH:mm');
        var content = {meta: {date: {}},  relative_path: 'foo-bar.md', stat: {mtime: date}};
        var val = get_date(content);
        expect(val.valueOf()).to.equal(date.valueOf());

    });

    it('should return no error and the moment object if content.meta.date is a parseable string', function () {
        var dstr = '2014/12/22 13:56';
        var mtime_str = '2013/12/22 13:56';
        var date = moment(dstr, 'YYYY/MM/DD HH:mm');
        var mtime_date = moment(mtime_str, 'YYYY/MM/DD HH:mm');
        var content = {meta: {date: dstr},  relative_path: 'foo-bar.md', stat: {mtime: mtime_date}};
        var val = get_date(content);
        expect(val.valueOf()).to.equal(date.valueOf());

    });

    it('should return no error and the moment object if content.meta.date is a less parseable string', function () {
        var dstr = '2014/12/22 13:56';
        var mtime_str = '2013/12/22 13:56';
        var date = moment(dstr, 'YYYY/MM/DD HH:mm');
        var mtime_date = moment(mtime_str, 'YYYY/MM/DD HH:mm');
        var content = {meta: {date: date.format('MMMM DD YYYY h:mm A')},  relative_path: 'foo-bar.md', stat: {mtime: mtime_date}};
        var val = get_date(content);
        expect(val.valueOf()).to.equal(date.valueOf());
        expect(val.format('YYYY')).to.equal('2014');

    });
});