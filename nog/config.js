/* jshint node: true */
module.exports = function (grunt) {
    'use strict';
    var async = require('async');
    var fs = require('fs');
    var path = require('path');

    var defaults = require('./get_default_config')(grunt);
    var existing = grunt.config.get('nog') || {};

    var cfg_req = path.join(process.cwd(), '_cfg', 'nog_config');
    var cfg_path = cfg_req + '.js';

    grunt.config.merge({
        nog: defaults
    });

    grunt.config.merge({
        nog: existing
    });

    if (require.cache[cfg_path]) {
        grunt.verbose.write('Clearing require cache for "' + cfg_path + '" file...').ok();
        delete require.cache[cfg_path];
     }

    if (fs.existsSync(cfg_path)){
        grunt.config.merge({
            nog: require(cfg_req)(grunt)
        });
    }

};
