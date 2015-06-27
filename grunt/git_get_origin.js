module.exports = function(grunt, callback){

    var exec = require('child_process').exec;
    var cmd = 'git config -z --get remote.origin.url';

    grunt.verbose.writeln('Getting origin: %s', cmd);
    exec(cmd, function(err, stdout){
        if (err) return callback(err);

        //@TODO:
        // not sure philosophically whether we should return an error
        // if the origin does not exist, but in the context of this project,
        // for now, we rely on the repo having a remote named "origin".
        // Perhaps this can be changed later.
        // For now...

        err = null;
        stdout = stdout.trim();
        if (stdout.length === 0) {
            err = new Error('No remote named "origin" exists.')
        }
        return callback(err, stdout);
    });
};