define(['jquery', 'sxml/sxml'], function($, sxml) {
    /* ��������� ����: */
    
    // http://stackoverflow.com/questions/1495219/
    $(document).unbind('keydown').bind('keydown', function (event) {
        var doPrevent = false;
        if (event.keyCode === 8) {
            var d = event.srcElement || event.target;
            if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE' || d.type.toUpperCase() === 'EMAIL' )) 
                 || d.tagName.toUpperCase() === 'TEXTAREA') {
                doPrevent = d.readOnly || d.disabled;
            }
            else {
                doPrevent = true;
            }
        }

        if (doPrevent) {
            event.preventDefault();
        }
    });
    
    // ������ ���������-�������
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

    // ������������� textarea
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

    // ����� ������������ �� Ctrl+Enter
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