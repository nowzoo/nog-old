/* jshint node: true */
module.exports = function (grunt) {
    'use strict';

    var defaults = require('./get_default_config')(grunt);
    var existing = grunt.config.get('nog');

    grunt.config.merge({
        nog: defaults
    });

    grunt.config.merge({
        nog: existing
    });

};
