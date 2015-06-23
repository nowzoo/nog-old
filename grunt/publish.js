/* jshint node: true */
module.exports = function (grunt, done) {
    'use strict';
    var fs = require('fs');
    var path = require('path');
    var Git = require('nodegit');
    var moment = require('moment');
    var async = require('async');
    var ncp = require('ncp').ncp;
    var rimraf = require('rimraf');
    var _ = require('lodash');

    var repo;
    var index;
    var oid;

    /**
     * require that we're on master
     * require
     */

    async.series(
        [
            function(callback){
                Git.Repository
                    .open(path.resolve(process.cwd(), './.git'))
                    .then(function(result) {
                        repo = result;
                        return repo.getStatus();
                    })
                    .then(function(result){
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
                        console.log('New Commit', result);
                    })
                    .then(function(){
                        return repo.checkoutBranch('gh-pages');

                    })

                    .then(function(result){
                        console.log('branch', result)
                        callback();
                    });

            },
            function(callback){
                var files;
                fs.readdir(process.cwd(), function(err, result){
                    files = result;
                    console.log (files);
                    callback();
                });

            }
        ], done
    )







};



