define([
    'jquery',  
    'sxml/sxml',
    'js/project/actions',
    'js/project/map-objects'
], function(
    $,
    sxml,
    actions,
    mapObjects
) {
    var PointBalloonForm = function(options) {
        mapObjects.RichBalloonForm.apply(this, arguments);
    };
    
    PointBalloonForm.prototype = $.extend({}, mapObjects.RichBalloonForm.prototype, {
        _entitySection : 'point',
        
        _classes : {
            editorSwitch : 'point-edit-button',
            editing : 'editing',
            editorForm : 'point-editor',
            deleteButton : 'point-delete-button',
            photoView : 'point-view-photos',
            photoEdit : 'point-edit-photos',
            markerControl : 'point-edit-marker',
            markerDropdown : 'point-marker-dropdown',
            markerDropdownElem : 'point-marker-dropdown-elem',
            confirmText : 'Удалить эту точку?'
        },

        _markers : [ 'point10', 'point11', 'point12', 'point20', 'point21', 'point22', 'point13', 'point3', 'point0' ],

        _serialize : function() {
            return {
                id : this._entityData.id,
                title : $(this._domElem).find('.point-title-input').val(),
                descr : $(this._domElem).find('textarea.text').val(),
                q : $(this._domElem).find('textarea.question').val(),
                marker : this._currentMarker,
                photos : this._photoEdit.val(),
            }
        }
    });
    
    var MapPointSet = function() {
        mapObjects.MapObjectSet.apply(this, arguments);
    }
    
    MapPointSet.prototype = $.extend({}, mapObjects.MapObjectSet.prototype, {
        _elemClass : PointBalloonForm,
        
        _greetPattern : { 'class' : 'point', role : 'map' },
        
        _actions : {
            submit : function(data) {
                actions.savePointData(
                    data.id,
                    data.title,
                    data.descr,
                    data.q,
                    data.marker,
                    data.photos,
                    $.proxy(function() {
                        this.openOnMap(data.id);
                    }, this)
                )
            },
            
            move : function(data) {
                actions.movePoint(data.id, data.coords);
            },
            
            'delete' : function(id) {
                actions.deletePoint(id)
            }
        }
    });
    
    var points = new MapPointSet();
    
    // Оживиляет комментарии и кнопки
    function _initListPointDOMElems(id, domElem) {
        // Включить-выключить режим редактирования
        $(domElem).find('.map-link').click(function() {
            points.openOnMap(id);
        });
    }
        
    function _initPointThreadDOMElem(domElem) {
        // Применяем стили, если нет ни одного комментария, разворачиваем-сворачиваем комментарии по клику, если они есть
        if ($(domElem).find('.point-comment').length == 0) {
            $(domElem).find('.point-comments')
                .addClass('empty hidable hidden').end()
                .find('.point-comments-header').click(function() {
                    $(this).next('.point-comments').toggleClass('hidden');
                });
        } else {
            $()
                .add($(domElem).find('.point-comments-header'))
                .add($(domElem).find('.point-comments'))
                .click(function() {
                    var comments = $(this).hasClass('point-comments') ? $(this) : $(this).next('.point-comments'); 
                    if (!(comments.hasClass('detached'))) {
                        comments.addClass('detached');
                        setTimeout(function() {
                            comments.addClass('fully-detached');
                        }, 10);
                    }
                });
            $(domElem).find('.point-comments-close').click(function() {
                $(this).closest('.point-comments').removeClass('fully-detached');
                setTimeout($.proxy(function() {
                    $(this).closest('.point-comments').removeClass('detached');
                }, this), 200);
            });
        }
            
        // Делаем в поле ввода коммента отступ по размеру имени
        $(domElem).find('.point-comments-editor .point-comment-input').each(function() {  
            var m = $(this).prevAll('.point-comment-username').clone().css('opacity', 0).appendTo('body'),
                l = m[0].offsetWidth + 5;
            $(m).detach();
            $(this).css('text-indent', l + 'px');
        });
        
        // Вешаем экшн на поле ввода коммента
        $(domElem).find('.point-comments-editor').submit(function(e) {
            actions.postComment($(this).closest('.point-comments-thread')[0].ondblclick().thread.id, $(this).find('.point-comment-input').val());
            e.preventDefault();
        });
    }
    
    sxml.greet({ sxml : { 'class' : 'point', role : 'list' } }, function(options) {
        _initListPointDOMElems(options.entity.sxml.item, options.node);
    });    

    sxml.greet({ sxml : { 'class' : 'thread' } }, function(options) {
        _initPointThreadDOMElem(options.node);
    });
    
    return points;
});