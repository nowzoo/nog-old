var log = module.exports = function(){
    var out = Array.prototype.slice.call(arguments, 0).join('');
    process.stdout.write(out);
};
module.exports.verbose = function(){
    if ('true' === process.env.verbose) {
        log.apply(null, arguments);
    }

};
