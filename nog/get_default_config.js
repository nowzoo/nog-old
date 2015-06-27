/* jshint node: true */
module.exports = function (grunt) {
    'use strict';
    var fs = require('fs');
    var path = require('path');
    var _ = require('lodash');



    return {
        title: 'Nog',
        tagline: 'A Grunt-based site manager for GitHub Pages.',
        site_url: '',
        site_prefix: '/nog',
        posts_per_page: 10,
        asset_contents_copy_to_site_root:  true,


        atomic_path: function (post, id) {
            var slugs;
            var type = post.type;
            if (type === 'post') {
                return path.join('posts', id);
            }
            slugs = post.parents ? _.clone(post.parents) : [];
            slugs.push(id);
            return slugs.join('/');
        },
        archive_path: function (archive, page) {
            var type = archive.type;
            var p;
            page = page || 0;

            switch (type) {
                case 'main':
                    p = 'posts';
                    break;
                case 'year':
                case 'month':
                case 'day':
                    p = path.join('posts', archive.slug);
                    break;
                case 'tag':
                    p = path.join('tags', archive.slug);
                    break;
                default:
                    throw(new Error('Unknown archive type'));
                    break;
            }
            if (page > 0) {
                p = path.join(p, 'page', page.toString());
            }
            return p;
        },
        search_path: function () {
            return 'search';
        }
    };

};


