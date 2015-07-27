var get_prefixed_uri = require('../content/get_prefixed_uri');
var get_relative_url = require('../content/get_relative_url');
module.exports = function(build, site){
    var site_root = get_relative_url(get_prefixed_uri(site, ''));
    return {
        build: build,
        site: site,
        site_root: site_root
    }
};
