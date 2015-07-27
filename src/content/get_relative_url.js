'use strict';
module.exports = function(base_uri){
    if ('' === base_uri) return '/';
    return '/' + base_uri + '/';
};

