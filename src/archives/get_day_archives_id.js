'use strict';
var moment = require('moment');
var get_main_archives_id = require('./get_main_archives_id');

module.exports = function(site, d){
    var parts = [get_main_archives_id(site)];
    var date = moment(d);
    parts.push(date.format('YYYY'));
    parts.push(date.format('MM'));
    parts.push(date.format('DD'));
    return parts.join('/');
};

