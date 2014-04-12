    require([
        'jquery',
        'sxml/sxml',
        'sxml/interface/rightsinput',
        'sxml/interface/fileinput',
        'js/utils/map',
        'js/project/controls',
        'js/project/actions',
        //'js/project/rollouts',
        'js/utils/inputs'
    ], function(
        $,
        sxml,
        RightsInput,
        FileInput,
        Map,
        controls,
        actions
        //rollouts
    ) {

    var project = {
    
        // Оживиляет комментарии и кнопки
        initMapPointDOMElems : function(entity, domElem) {
            var id = entity.sxml.item;

            // Включить-выключить режим редактирования
            $(domElem).find('.point-edit-button').click(function(e) {
                $(this).closest('.point').toggleClass('editing');  
                e.preventDefault();
            })

            var photoView = new FileInput($(domElem).find('.point-view-photos'), {
                    val : entity.point.photos,
                    readOnly : true
                }),
                photoEdit = new FileInput($(domElem).find('.point-edit-photos'), {
                    val : entity.point.photos
                });

            // Сохранение
            $(domElem).find('.point-editor').submit(function(e) {
                $(this).closest('.point').hasClass('editing') && actions.savePointData(
                    id,
                    $(domElem).find('.point-title-input').val(),
                    $(domElem).find('textarea.text').val(),
                    $(domElem).find('textarea.question').val(),
                    photoEdit.val(),
                    function(options) {
                        project._map.openObjectBalloon(options.entity.map.uniqueId);
                    }
                );
                e.preventDefault();
            });
            
            // Удаление
            $(domElem).find('.point-delete-button').click(function(e) {
                sxml.Notifier.show(
                    $('<div/>')
                        .html('Хотите удалить эту точку? ')
                        .append($('<a/>')
                            .html('Да')
                            .addClass('button')
                            .attr('href', '/')
                            .click(function(e) {
                                actions.deletePoint(id);
                                e.preventDefault();
                            })
                        )
                );
            });
            
        },
        
        // Оживиляет комментарии и кнопки
        initListPointDOMElems : function(id, domElem) {
            // Включить-выключить режим редактирования
            $(domElem).find('.map-link').click($.proxy(function(e) {
                this._map.openObjectBalloon(sxml.getEntity(domElem).point.mapId);
                e.preventDefault();
            }, this));
        },        
        
        _onPointBalloonClose : function(node) {
            if (node && sxml.getEntity(node) && sxml.getEntity(node).point.empty === 'true') {
                actions.deletePoint(sxml.getEntity(node).point.id);
            }
        },
        
        _onPointDragEnd : function(data) {
            if (data.node && sxml.getEntity(data.node)) {
                actions.movePoint(sxml.getEntity(data.node).point.id, data.coords);
            }
        },    
        
        initPointThreadDOMElem : function(domElem) {
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
        },
        
        initProjectDOMElems : function() {
            var input = new RightsInput($('.project-orgs .userinput'), this.data.orgs, { mutable : false });
        },
        
        init : function() {
            this._map = new Map('project-map', [
                controls.createClicker({
                    image : 'img/point11-xs.png',
                    title : 'Поставить точку'
                }, function(coords) {
                    actions.createPoint(project.data.id, coords, function(options) {
                        project._map.openObjectBalloon(options.entity.map.uniqueId);
                        $(options.node).toggleClass('editing');
                    });
                }, project)
            ], [70, 270, 0, 0]);
            this._map.startGreeting(sxml);
            this._map.on('balloonclose', $.proxy(this._onPointBalloonClose, this));
            this._map.on('dragend', $.proxy(this._onPointDragEnd, this));
            //this.initProjectDOMElems();
            
            sxml.ready();
            this._map.reframe();
        },
        
        data : {}
       
    };

    sxml.greet({ sxml : { 'class' : 'project' } }, function(options) {
        project.data.id = options.entity.sxml.item;
        project.data.orgs = options.entity.project.orgs;
        project.initProjectDOMElems();
    });

    sxml.greet({ sxml : { 'class' : 'point', role : 'map' } }, function(options) {
        project.initMapPointDOMElems(options.entity, options.node);
    });
    
    sxml.greet({ sxml : { 'class' : 'point', role : 'list' } }, function(options) {
        project.initListPointDOMElems(options.entity.sxml.item, options.node);
    });    

    sxml.greet({ sxml : { 'class' : 'thread' } }, function(options) {
        project.initPointThreadDOMElem(options.node);
    });

    //------------

    // Костыль для загрузки Я.Карт при xslt
    window._init = function() {
        project.init();
    }

});