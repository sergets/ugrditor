define([
    'sxml/sxml',
    'sxml/interface/fileinput',
    'sxml/utils/observable'
], function(
    sxml,
    FileInput,
    Observable
) {
    var news = new Observable();

    sxml.greet({ sxml : { 'class' : 'news' } }, function(options) {
        initNewsDOMElems(options);
    });
    
    function initNewsDOMElems(options) {
        $($(options.node).find('.news-ref')[0]).click(function() {
            news.trigger('refclick', { type : options.entity.news.reftype, id : options.entity.news.ref });
        });

        if (options.entity.news.type == 'editpointphotos') {
            var file = $(options.node).find('.news-photos-fileinput'),
                data = file && file[0] && file[0].ondblclick(),
                input = data && new FileInput(file, {
                    val : data.photos,
                    readOnly : true,
                    onClick : function(hash, val) {
                        gallery.open(hash, val.split(' '));
                    }
                });
        }
    }
    
    return news;
});