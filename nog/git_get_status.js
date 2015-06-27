module.exports = function(grunt, callback){
    //origin	git@github.com:nowzoo/nog.git (fetch)
    //origin	git@github.com:nowzoo/nog.git (push)

    var exec = require('child_process').exec;
    var _ = require('lodash');
    var S = require('string');

    var cmd = 'git status --porcelain';

    grunt.verbose.writeln('Getting status: %s', cmd);

    exec(cmd, function(err, stdout){
        if (err) return callback(err);
        callback(err, stdout.length > 0);
    });


};
