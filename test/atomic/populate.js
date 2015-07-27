/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var async = require('async');
var moment = require('moment');
var fs = require('fs-extra');
var _ = require('lodash');
var sprintf =  require('sprintf-js').sprintf;
var temp = require('temp').track();

var read_all = require('../../src/atomic/read_all');
var read_site = require('../../src/site_json/read');
var populate = require('../../src/atomic/populate');

var test_helpers = require('../test_helpers');


var default_render_markdown = require('../../src/render/markdown');

describe('#atomic/populate()', function(){


    var input_directory;
    var build;
    var contents;
    var site;
    var tests = [
        {slugs: ['index.md']},
        {slugs: ['bar.md']}
    ];
    before(function(done){

        async.series(
            [
                function(callback){
                    temp.mkdir('nog-cli-test-', function(err, result){
                        input_directory = result;
                        build = {
                            input_directory: input_directory,
                            public: true,
                            published_only: true
                        };
                        callback(err);
                    });
                },
                function(callback){
                    test_helpers.set_contents(input_directory, tests, function(){
                        read_all(build, function(err, result){
                            contents = result;
                            callback(err);
                        });
                    })
                },
                function(callback){
                    read_site(build, function(err, result){
                        site = result;
                        site.render_markdown = default_render_markdown;
                        callback(err);
                    })
                }
            ],
            function(){
                done();
            }
        );



    });

    it('should callback with no error', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(err).to.be.null;
            done();
        })

    });
    it('should set content.id as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.id).to.be.a('string');
            done();
        });

    });
    it('should set content.basename  as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.basename).to.be.a('string');
            done();
        });

    });
    it('should set content.type  as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.type).to.be.a('string');
            done();
        });

    });
    it('should set content.uri as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.uri).to.be.a('string');
            done();
        });

    });
    it('should set content.title as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.title).to.be.a('string');
            done();
        })
    });
    it('should set content.date as a moment', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.date).to.be.an('object');
            done();
        })
    });
    it('should set content.published as a boolean', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.published).to.be.an('boolean');
            done();
        })
    });
    it('should set content.tags as an array', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.tags).to.be.an('array');
            done();
        })
    });
    it('should set content.template as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.template).to.be.an('string');
            done();
        })
    });
    it('should set content.ignored as a boolean', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.ignored).to.be.an('boolean');
            done();
        })
    });
    it('should set content.parent', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content).to.include.keys('parent');
            done();
        })
    });
    it('should set content.children as an array', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.children).to.be.an('array');
            done();
        })
    });
    it('should set content.relative_url as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.relative_url).to.be.an('string');
            done();
        })
    });
    it('should set content.absolute_url as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.absolute_url).to.be.an('string');
            done();
        })
    });
    it('should set content.content as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.content).to.be.an('string');
            done();
        })
    });
    it('should set content.excerpt as a string', function(done){
        var content = contents['index.md'];
        populate(build, site, content, contents, function(err){
            expect(content.excerpt).to.be.an('string');
            done();
        })
    });


});
