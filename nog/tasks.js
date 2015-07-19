/* jshint node: true */
module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    var fs = require('fs');
    var _ = require('lodash');
    var moment = require('moment');



    var show = require('./show');
    var build = require('./build');
    var push = require('./push');
    var get_data = require('./get_data');

    var nog = require('./nog');
    var lint = require('./nog-lint');


    grunt.registerTask('nog', function (subtask) {
        var done = this.async();
        var rgh = 'Run grunt nog:help for assistance.';
        subtask = subtask || 'nog';
        switch (subtask) {
            case 'nog':
                nog.call(this, grunt, done);
                break;
            case 'push':
                push.call(this, grunt, done);
                break;
            case 'lint':
                lint.call(this, grunt, done);
                break;
            case 'help':
                var help = grunt.file.read(path.join(process.cwd(), 'nog', 'messages', 'help.txt'));
                console.log(help);
                done();
                break;
            case 'build':
                var err = null;
                var dir = grunt.option('file') || '';
                var abs;
                if (dir.length === 0){
                    err = new Error('Specify a directory path with the --file=<path> option. %s', rgh);
                } else {
                    abs = path.resolve(dir);
                    if (fs.existsSync(abs)){
                        err = new Error('%s exists! Nog won\'t write to an existing directory. %s', abs, rgh);
                    } else {
                        if (abs.indexOf(process.cwd()) === 0){
                            err = new Error('%s is in the present working directory! Nog won\'t write to the working directory. %s', abs, rgh);
                        }
                    }

                }
                if (err) return done(err);
                build.call(this, grunt, abs, done);
                break;
            default:
                grunt.log.error('Unknown task: %s. %s', subtask, rgh);
                break;

        }

    });




};
