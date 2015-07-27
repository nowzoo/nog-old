var write_search_index = function(build_data, output_directory, changed_uris, callback){
    var start = moment();
    var p;
    var slugs = ['search.json'];
    var uri;
    if (0 < build_data.config.prefix.length && ! build_data.is_build_public){
        slugs.unshift(build_data.config.prefix);
    }
    uri = '/' + slugs.join('/');
    changed_uris.push(uri);
    log.verbose(colors.gray.bold('\nWriting search.json... \n'));

    p =  path.join(output_directory, slugs.join(path.sep));
    fs.writeJSON(p, build_data.search_index, function(err){
        if (! err){
            log.verbose('\t', colors.gray(sprintf(
                        'Done writing search.json in %ss. URI: %s',
                        (moment().valueOf() - start.valueOf())/1000,
                        uri
                    )

                ), '\n'
            );
        }
        callback(err);
    });

};

var write_search = function(build_data, output_directory, changed_uris, callback){
    var start = moment();
    var p;
    var slugs = ['search', 'index.html'];
    var uri;
    var out;
    var template = path.join(build_data.input_directory, '_templates', 'search.twig');
    if (0 < build_data.config.prefix.length && ! build_data.is_build_public){
        slugs.unshift(build_data.config.prefix);
    }
    uri = '/' + slugs.join('/');
    changed_uris.push(uri);
    changed_uris.push('/search/');
    log.verbose(colors.gray.bold('\nWriting search/index.html... \n'));

    p =  path.join(output_directory, slugs.join(path.sep));

    var passed = {
        site: build_data.config,
        site_root: 0 < build_data.config.prefix.length ? '/' + build_data.config.prefix + '/' : '/',
        search_index: build_data.search_index
    };

    async.series(
        [
            function (callback) {
                swig.setDefaults({ cache: false });
                swig.renderFile(template, passed, function(err, result){
                    out = result;
                    callback(err);
                });
            },
            function(callback) {
                fs.outputFile(p, out, callback);
            }
        ], callback
    );


};

var write_built = function(build_data, output_directory, callback){
    var start = moment();
    var p = path.join(output_directory, '.built.json');
    log.verbose(colors.gray.bold('\nWriting .built.json... \n'));
    fs.writeJSON(p, {built: moment(), prefix: build_data.config.prefix}, function(err){
        if (! err){
            log.verbose('\t', colors.gray(sprintf('Done writing .built.json in %ss.',(moment().valueOf() - start.valueOf())/1000)), '\n');
        }
        callback(err);
    });

};
