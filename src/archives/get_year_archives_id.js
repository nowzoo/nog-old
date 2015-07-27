'use strict';
var moment = require('moment');
var get_main_archives_id = require('./get_main_archives_id');

module.exports = function(site, d){
    var parts = [get_main_archives_id(site)];
    var date = moment(d);
    parts.push(date.format('YYYY'));
    return parts.join('/');
};

