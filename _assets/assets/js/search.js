$(document).ready(function(){
    var list = $('#search-results-list');
    var input = $('#search-box');


    input.on('input', function(){
        var search = $.trim(input.val()).toLowerCase();
        var matches = [];
        var words;
        if (2 < search.length){
            words = search.split(/\W+/);
            _.each(words, function(search_word){
                _.each(search_index, function(arr, word){
                    if (word.indexOf(search_word) >= 0){
                        matches = matches.concat(arr);
                    }
                });
            })

        }
        $('>article', list).hide();
        _.each(matches, function(uri){
            $('article[data-uri="' + uri + '"').show();
        });
    });
});
