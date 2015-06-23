/* jshint node: true */
module.exports = function (grunt, done) {
    'use strict';

    var path = require('path');
    var Git = require('nodegit');
    var moment = require('moment');
    var ncp = require('ncp').ncp;
    var rimraf = require('rimraf');
    var promisify = require('promisify-node');
    var _ = require('lodash');

    var fs = promisify('fs');
    var async = promisify('async');

    var repo;
    var index;
    var oid;
    var files;
    var remote;

    /**
     * require that we're on master
     * require
     */

    Git.Repository
        .open(path.resolve(process.cwd(), './.git'))
        .then(function(result) {
            repo = result;
        })
        .then(function(){
            grunt.log.subhead('Checking out master...');
            return repo.checkoutBranch('master');
        })
        .then(function(){
            return repo.openIndex()
        })
        .then(function(result) {
            index = result;
            return index.read(1);
        })
        .then(function() {
            return index.addAll();
        })
        .then(function() {
            return index.write();
        })
        .then(function() {
            return index.writeTree();
        })
        .then(function(result) {
            oid = result;
            return Git.Reference.nameToId(repo, "HEAD");
        })
        .then(function(result) {
            return repo.getCommit(result);
        })
        .then(function(result) {
            var signature = Git.Signature.default(repo);
            var msg = 'Commit before publishing on ' + moment().format('LLLL');
            return repo.createCommit("HEAD", signature, signature, msg, oid, [result]);
        })
        .then(function(result) {
            grunt.log.writeln('New commit on master: %s', result);
        })
        .then(function(){
            grunt.log.subhead('Checking out gh-pages...');
            return repo.checkoutBranch('gh-pages');
        })
        .then(function(){
            return fs.readdir(process.cwd());
        })
        .then(function(files){
            var keep = [ '.git', '.gitignore', '.idea', '_site', 'node_modules' ];
            grunt.log.subhead('Deleting content...');
            _.each(files, function(filename){
                if (_.indexOf(keep, filename) >= 0) return;
                if (filename.indexOf('.') === 0) return;
                grunt.log.writeln('%s deleted.', filename);
                rimraf.sync(filename);
            });
        })
        
        .then(function(){
            grunt.log.subhead('Adding content...');
            grunt.file.recurse(path.join(process.cwd(), '_site'), function(abspath, rootdir, subdir, filename){
                var dst = process.cwd();
                if (subdir) dst = path.join(dst, subdir, filename );
                else dst = path.join(dst, filename);
                grunt.file.copy(abspath, dst);
                grunt.log.writeln('%s created.',  dst);
            });
        })

        .then(function(){
            grunt.log.subhead('Committing changes...');
            return repo.openIndex()
        })
        .then(function(result) {
            index = result;
            return index.read(1);
        })
        .then(function() {
            return index.addAll();
        })
        .then(function() {
            return index.write();
        })
        .then(function() {
            return index.writeTree();
        })
        .then(function(result) {
            oid = result;
            return Git.Reference.nameToId(repo, "HEAD");
        })
        .then(function(result) {
            return repo.getCommit(result);
        })
        .then(function(result) {
            var signature = Git.Signature.default(repo);
            var msg = 'Nog automated commit to gh-pages on ' + moment().toISOString();
            return repo.createCommit("HEAD", signature, signature, msg, oid, [result]);
        })
        .then(function(result) {
            grunt.log.writeln('New commit on gh-pages: %s', result);
        })
        .then(function() {
            grunt.log.subhead('Pushing to origin gh-pages...');
            return repo.getRemote('origin');
        })
        .then(function(result) {
            grunt.log.writeln('Remote loaded.');
            remote = result;
           
        })

        .then(function() {
            remote.setCallbacks({
                credentials: function(url, userName) {
                    return Git.Cred.sshKeyFromAgent(userName);
                }
            });
            grunt.log.writeln('Remote configured.');
            return remote.connect(Git.Enums.DIRECTION.PUSH);

        })
        .then(function() {

            var msg = 'Nog automated push to gh-pages. ' + moment().toISOString();
            grunt.log.writeln('Connected:', remote.connected());
            return remote.push(
                ['refs/heads/gh-pages:refs/heads/gh-pages'],
                null,
                repo.defaultSignature(),
                msg
            )
        })
        .then(function() {
            grunt.log.ok('Remote pushed!')
        })
        .then(function(){
            grunt.log.subhead('Checking out master.');
            return repo.checkoutBranch('master');
        })

        .catch(function(reason) {
            grunt.log.error(reason);
            done();
        })

        .done(function(){
            done();
        });






    //                .catch(function(reason) {
    //                    console.log(reason);
    //                })
    //                .done(function(){
    //                    callback();
    //                })
    //
    //        }
    //    ], done
    //)







};



