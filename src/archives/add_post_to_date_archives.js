"use strict";
var _ = require('lodash');
var S = require('string');
var moment = require('moment');
var sprintf = require('sprintf-js').sprintf;

var get_date = require('../atomic/get_date');

var get_relative_url = require('../content/get_relative_url');
var get_absolute_url = require('../content/get_absolute_url');

var get_year_archives_id = require('./get_year_archives_id');
var get_year_archives_uri = require('./get_year_archives_uri');
var get_month_archives_id = require('./get_month_archives_id');
var get_month_archives_uri = require('./get_month_archives_uri');
var get_day_archives_id = require('./get_day_archives_id');
var get_day_archives_uri = require('./get_day_archives_uri');




module.exports = function(site, archives, post){
    var date;
    var slug;
    var uri;
    var name;

    date = moment(get_date(post));
    slug = date.format('YYYY');
    uri = get_year_archives_uri(site, date);
    name = date.format(site.archives_year_name_format);
    if (!_.has(archives.dates, slug)){

        archives.dates[slug] = {
            id: get_year_archives_id(site, date),
            uri: uri,
            relative_url: get_relative_url(uri),
            absolute_url: get_absolute_url(site, uri),
            type: 'year',
            name: name,
            title: sprintf(site.archives_year_title_format, name),
            posts: []

        };
    }
    archives.dates[slug].posts.push(post);

    date = moment(get_date(post));
    slug = date.format('YYYY/MM');
    uri = get_month_archives_uri(site, date);
    name = date.format(site.archives_month_name_format);
    if (!_.has(archives.dates, slug)){

        archives.dates[slug] = {
            id: get_month_archives_id(site, date),
            uri: uri,
            relative_url: get_relative_url(uri),
            absolute_url: get_absolute_url(site, uri),
            type: 'month',
            name: name,
            title: sprintf(site.archives_month_title_format, name),
            posts: []

        };
    }
    archives.dates[slug].posts.push(post);

    date = moment(get_date(post));
    slug = date.format('YYYY/MM/DD');
    uri = get_day_archives_uri(site, date);
    name = date.format(site.archives_day_name_format);
    if (!_.has(archives.dates, slug)){

        archives.dates[slug] = {
            id: get_day_archives_id(site, date),
            uri: uri,
            relative_url: get_relative_url(uri),
            absolute_url: get_absolute_url(site, uri),
            type: 'day',
            name: name,
            title: sprintf(site.archives_day_title_format, name),
            posts: []

        };
    }
    archives.dates[slug].posts.push(post);

};
