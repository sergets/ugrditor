define([
    'jquery',  
    'sxml/sxml',
    'js/project/actions',
    'sxml/interface/rightsinput',
    'js/project/map-objects'
], function(
    $,
    sxml,
    actions,
    RightsInput,
    mapObjects
) {
    var TaskBalloonForm = function(options) {
        mapObjects.RichBalloonForm.apply(this, arguments);
    };
    
    TaskBalloonForm.prototype = $.extend({}, mapObjects.RichBalloonForm.prototype, {
        _entitySection : 'point',
        
        _classes : {
            editorSwitch : 'task-edit-button',
            editing : 'editing',
            editorForm : 'task-editor',
            deleteButton : 'task-delete-button',
            photoView : 'task-view-photos',
            photoEdit : 'task-edit-photos',
            rightsView : 'task-view-rights',
            rightsEdit : 'task-edit-rights',
            markerControl : 'edit-marker',
            markerDropdown : 'marker-dropdown',
            markerDropdownElem : 'marker-dropdown-elem',
            confirmText : 'Удалить эту загадку?'
        },

        _markers : [ 'task11' ],

        _serialize : function() {
            return {
                id : this._entityData.id,
                title : $(this._domElem).find('.task-title-input').val(),
                text : $(this._domElem).find('textarea.text').val(),
                concerning : this._rightsEdit.val(),
                marker : this._currentMarker,
                photos : this._photoEdit.val(),
            }
        },
        
        _init : function() {
            RichBalloonForm.prototype._init.apply(this, arguments);
            this._initRights();
        },

        _initRights : function() {
            this._rightsView = new RightsInput($(this._domElem).find('.' + this._classes.rightsView), {
                val : this._entityData.concerning,
                readOnly : true
            });
            this._rightEdit = new RightsInput($(this._domElem).find('.' + this._classes.rightsEdit), {
                val : this._entityData.concerning
            });
        }
    });
    
    var MapTaskSet = function() {
        mapObjects.MapObjectSet.apply(this, arguments);
    }
    
    MapTaskSet.prototype = $.extend({}, mapObjects.MapObjectSet.prototype, {
        _elemClass : TaskBalloonForm,
        
        _greetPattern : { 'class' : 'task', role : 'map' },
        
        _actions : {
            submit : function(data) {
                actions.saveTaskData(
                    data.id,
                    data.title,
                    data.text,
                    data.concerning,
                    data.marker,
                    data.photos,
                    $.proxy(function() {
                        this.openOnMap(id);
                    }, this)
                )
            },
            
            move : function(data) {
                actions.moveTask(data.id, data.coords);
            },
            
            'delete' : function(id) {
                actions.deleteTask(id)
            }
        }
    });
    
    var tasks = new MapTaskSet();
    
    /*
    
    // Оживиляет комментарии и кнопки
    function _initListPointDOMElems(id, domElem) {
        // Включить-выключить режим редактирования
        $(domElem).find('.map-link').click(function() {
            points.openOnMap(id);
        });
    },
        
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
    });*/
    
    return tasks;
});