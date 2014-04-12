define(['jquery', 'sxml/sxml'], function($, sxml) {
    /* Служебные вещи: */
    
    // Кнопки «показать-скрыть»
    var initHiders = function(nodes) {
        nodes
            .filter(':not(.hider-binded)')
            .addClass('hider-binded')
            .click(function() {
                var next = $($(this).next('.hidable')[0]),
                    length = 500,
                    interval = setInterval(function() { 
                        next[0].scrollIntoView();
                    }, length / 5);
                setTimeout(function() {
                    clearTimeout(interval);
                }, length);
                next.toggleClass('hidden');
            });
    };

    // Расширяющиеся textarea
    var startTextarea = function(nodes) {
        nodes.filter(':not(.textarea-binded)').bind('keypress keydown keyup click mousemove change', function() {
            setTimeout($.proxy(function() {
                var v = $(this).val();
                if (!$(this).data('measure')) {
                    $(this).data('measure', $('<div class="textarea-measure"/>').prependTo('body'));
                }
                $(this).data('measure').css('width', $(this).width());
                $(this).data('measure').html(v.replace(/\n/g, '<br/>').replace(/<br\/>$/g, '<br>&nbsp;'));
                $(this).css('height', $(this).data('measure').height() + 5);
            }, this), 0);
        }).addClass('textarea-binded').trigger('click');
    };

    // Формы отправляются по Ctrl+Enter
    var startForm = function(nodes) {
        nodes.find('input, textarea').filter(':not(.form-binded)').bind('keypress', function(e) {
            var code = e.keyCode ? e.keyCode : e.which;
            if ((code == 13 || code == 10) && e.ctrlKey) {
                $(this).closest('form').submit();
                e.preventDefault();
            }
        }).addClass('form-binded');
    };

    sxml.greet({}, function(options) {
        startTextarea($(options.node).find('textarea'));
        startForm($(options.node).find('form'));
        initHiders($(options.node).find('.hider'));
    });
});