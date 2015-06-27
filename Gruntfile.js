/* jshint node: true */
module.exports = function (grunt) {
    'use strict';

    var path = require('path');

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';


    grunt.initConfig({
      nog: {
          //include your site configuration here
      }

    });



    require('./nog/config')(grunt);
    require('./nog/watches')(grunt);
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
    require('./nog/tasks')(grunt);

    grunt.config.merge({
      less: {
        compile: {
          files: {
            'nog_assets/assets/theme/css/style.css': 'nog_assets/assets/theme/less/style.less',
          }

        }
      },
      watch: {
        less: {
          files: ['./nog_assets/assets/theme/less/**/*.less'],
          tasks: ['less:compile']
        }
      }
    });


    grunt.registerTask('update_readmes', 'Copies the home page md to ./README.md and nog_assets/README.md', function(){
        var src = './nog_content/index/index.md';
        var dst = './README.md';
        var yamlFront = require('yaml-front-matter');
        var data = yamlFront.loadFront(grunt.file.read(src));
        grunt.file.write(dst, data.__content);
        dst = './nog_assets/README.md';
        grunt.file.write(dst, data.__content);
    });


    // Default task. Feel free to change this.
    grunt.registerTask('default', function(){
        grunt.log.oklns('Hello from %s!', grunt.config.get('nog.title'));
    });
};
