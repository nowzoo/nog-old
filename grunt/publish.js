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
            grunt.log.write('New commit on master: %s', result);
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
            _.each(files, function(filename){
                if (_.indexOf(keep, filename) >= 0) return;
                if (filename.indexOf('.') === 0) return;
                grunt.log.write('Deleting content...', filename);
                rimraf.sync(filename);
            });
        })
        
        .then(function(){
            grunt.file.recurse(path.join(process.cwd(), '_site'), function(abspath, rootdir, subdir, filename){
                console.log(abspath, rootdir, subdir, filename)
            });
        })
        .then(function() {
            return repo.getRemote('origin');
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


    //        function(callback){
    //            var p = path.join(process.cwd(), '_site');
    //            fs.readdir(p, function(err, result){
    //                files = result;
    //                console.log(files);
    //                callback();
    //            });
    //
    //        },
    //
    //        function(callback){
    //            async.eachSeries(files, function(filename, callback){
    //                var src = path.join(process.cwd(), '_site', filename);
    //                var dst = path.join(process.cwd(), filename);
    //                ncp(src, dst, callback);
    //            }, callback)
    //
    //        },
    //        function(callback){
    //            repo.openIndex()
    //                .then(function(result){
    //                    index = result;
    //                    return index.read(1);
    //                })
    //                .then(function() {
    //                    return index.addAll();
    //                })
    //                .then(function() {
    //                    return index.write();
    //                })
    //                .then(function() {
    //                    return index.writeTree();
    //                })
    //                .then(function(result) {
    //                    oid = result;
    //                    return Git.Reference.nameToId(repo, "HEAD");
    //                })
    //                .then(function(result) {
    //                    return repo.getCommit(result);
    //                })
    //                .then(function(result) {
    //                    var signature = Git.Signature.default(repo);
    //                    var msg = 'Commit on gh-pages branch before publishing on ' + moment().format('LLLL');
    //                    return repo.createCommit("HEAD", signature, signature, msg, oid, [result]);
    //                })
    //                .then(function(result) {
    //                    console.log('New Commit on gh-pages', result);
    //                })
    //                .then(function() {
    //                    return repo.getRemote('gh-pages');
    //                })
    //                .then(function(result) {
    //
    //                    console.log('remote loaded');
    //                    remote = result;
    //
    //                    remote.setCallbacks({
    //                        credentials: function(url, userName) {
    //                            return Git.Cred.sshKeyFromAgent(userName);
    //                        }
    //                    });
    //
    //                    console.log('remote configured');
    //                    return remote.connect(Git.Enums.DIRECTION.PUSH);
    //
    //                })
    //                .then(function() {
    //                    console.log('remote Connected?', remote.connected());
    //
    //                    return remote.push(
    //                        ["refs/heads/gh-pages:refs/heads/gh-pages"],
    //                        null,
    //                        repo.defaultSignature(),
    //                        "Push to gh-pages")
    //                })
    //                .then(function() {
    //                    console.log('remote Pushed!')
    //                })
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



