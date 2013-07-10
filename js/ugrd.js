/* Служебные вещи: */

// Кнопки «показать-скрыть»
$('.hider').click(function() {
    $($(this).next('.hidable')[0]).toggleClass('hidden');
});

// Расширяющиеся textarea
$('textarea').bind('keypress keydown keyup click mousemove change', function() {
    setTimeout($.proxy(function() {
        var v = $(this).val();
        if (!$(this).data('measure')) {
            $(this).data('measure', $('<div class="textarea-measure"/>').prependTo('body'));
        }
        $(this).data('measure').css('width', $(this).width());
        $(this).data('measure').html(v.replace(/\n/g, '<br/>').replace(/<br\/>$/g, '<br>&nbsp;'));
        $(this).css('height', $(this).data('measure').height() + 5);
    }, this), 0);
}).trigger('click');

// Формы отправляются по Ctrl+Enter
$('form input, form textarea').bind('keypress', function(e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if ((code == 13 || code == 10) && e.ctrlKey) {
        $(this).closest('form').submit();
        e.preventDefault();
    }
});