SXML.Project = {

    _pendingMapObjects : {},
    _mapObjects : {},
    _mapReady : false,

    // Инициализация карты
    initMap : function() {
    
        // Создаём карту
        var map = SXML.Project.map = new ymaps.Map('project-map', {
            center: [55.79, 37.48], // Москва
            zoom: 13
        });
        map.behaviors.enable('scrollZoom');
        
        // Добавляем контролы
        var topToolBar = new ymaps.control.ToolBar([
            'mapTools',
            new ymaps.control.ToolBarSeparator(5),
            SXML.Project.Controls.createPointButton(map)
        ], { position: { top: 75, left: 5 } });
        map.controls.add(new ymaps.control.ToolBar([ 'typeSelector' ], { position: { top: 75, right: 5 } }));
        map.controls.add(new ymaps.control.ToolBar([ 'zoomControl' ], { position: { top: 115, left: 5 } }));
        map.controls
            .add(topToolBar)
            .add('scaleLine');
            
        map.balloon.events.add('open', function(b) {
            var balloon = SXML.Project.currentBalloon = b.get('balloon')
                content = $(balloon.getOverlay().getElement()).find(':not(ymaps):eq(0)'),
                height = content[0].offsetHeight;
                
            SXML.Project._balloonInterval = setInterval(function() {
                if (content[0].offsetHeight != height) {
                    height = content[0].offsetHeight;
                    var focused = $(content).find(':focus');
                    // TODO: IE сбрасывает range!!!
                    balloon.getOverlay().events.fire('datachange', {
                        newData : balloon.getOverlay().getData()
                    });
                    focused.focus();
                }
            }, 10);
        });
        map.balloon.events.add('close', function() {
            clearInterval(SXML.Project._balloonInterval);
        });
            
        // Тривиальный лейаут для балуна
        SXML.Project.balloonLayout = ymaps.templateLayoutFactory.createClass('$[[options.contentBodyLayout]]');
    
        SXML.Project._mapReady = true;
    },
    
    // Инициализация точки
    initMapObject : function(node, mapData) {
        if (SXML.Project._mapReady) {
            var mapObject = new ymaps.Placemark([+mapData.lat, +mapData.lon], {
                balloonContentLayout : SXML.Project.balloonLayout,
                balloonContent : node
            }, SXML.Project.getIconSettings(SXML.Project.map.getZoom()));
            mapObject.events.add('balloonclose', function(e) {
                SXML.Project._onPointBalloonClose(e, node);
            });
            SXML.Project.map.geoObjects.add(mapObject);
            SXML.Project.map.events.add('boundschange', function(e) {
                var nz = e.get('newZoom');
                if (nz != e.get('oldZoom')) {
                    mapObject.options.set(SXML.Project.getIconSettings(nz));
                }
            });
            SXML.Project._mapObjects[mapData.uniqueId] = mapObject;
        } else {
            SXML.Project._pendingMapObjects[mapData.uniqueId] = arguments;
        }
    },
    
    // Убирание точки
    destroyMapObject : function(uniqueId) {
        if (SXML.Project._mapReady) {
            SXML.Project.map.geoObjects.remove(SXML.Project._mapObjects[uniqueId]);
            delete SXML.Project._mapObjects[uniqueId];
        } else {
            delete SXML.Project._pendingMapObjects[uniqueId];
        }
    },
    
    // Открытие балуна на точке по айдишнику
    openObjectBalloon : function(uniqueId) {
        if (SXML.Project._mapReady && SXML.Project._mapObjects[uniqueId]) {
            SXML.Project._mapObjects[uniqueId].balloon.open();
        } else {
            console.warn('not yet!');
            // TODO
        }
    },    
    
    // Вычисление картинки значка для точки по зуму
    getIconSettings : function(zoom) {
        if (zoom <= 12) return {
            iconImageHref : 'img/point11-s.png',
            iconImageSize : [20, 20],
            iconImageOffset : [-7, -17]
        };
        if (zoom >= 15) return {
            iconImageHref : 'img/point11-l.png',
            iconImageSize : [44, 44],
            iconImageOffset : [-15, -37]
        };
        return {
            iconImageHref : 'img/point11-m.png',
            iconImageSize : [30, 30],
            iconImageOffset : [-11, -25]
        }
        // TODO: спрайты!!!
    },
    
    // Инициализация всех точек, которые показались до появления карты
    initPendingObjects : function() {
        $.each(SXML.Project._pendingMapObjects, function(i, arr) {
            SXML.Project.initMapObject.apply(SXML.Project, arr);
            SXML.Project._pendingMapObjects[i] = null;
        });
    },
    
    // Оживиляет комментарии и кнопки
    initPointDOMElems : function(id, domElem) {
        // Включить-выключить режим редактирования
        $(domElem).find('.point-edit-button').click(function(e) {
            $(this).closest('.point').toggleClass('editing');  
            e.preventDefault();
        });
        
        // Сохранение
        $(domElem).find('.point-editor').submit(function(e) {
            $(this).closest('.point').hasClass('editing') && SXML.Project.Actions.savePointData(id, $(domElem).find('.point-title-input').val(), $(domElem).find('textarea.text').val(), $(domElem).find('textarea.question').val());
            e.preventDefault();
        });
        
        // Удаление
        $(domElem).find('.point-delete-button').click(function(e) {
            SXML.Notifier.show(
                $('<div/>')
                    .html('Хотите удалить эту точку? ')
                    .append($('<a/>')
                        .html('Да')
                        .addClass('button')
                        .attr('href', '/')
                        .click(function(e) {
                            SXML.Project.Actions.deletePoint(id);
                            e.preventDefault();
                        })
                    )
            );
        });
        
    },
    
    _onPointBalloonClose : function(e, node) {
        if (node && SXML.getEntity(node) && SXML.getEntity(node).point.empty === 'true') {
            SXML.Project.Actions.deletePoint(SXML.getEntity(node).point.id);
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
            SXML.Project.Actions.postComment($(this).closest('.point-comments-thread')[0].ondblclick().thread.id, $(this).find('.point-comment-input').val());
            e.preventDefault();
        });
    },
    
    init : function() {
        SXML.Project.initMap();
        SXML.Project.initPendingObjects();
    },
    
    // Неймспейс для кастомных контролов
    Controls : {
    
        // Добавление новой точки
        createPointButton : function(map) {
            var pointButton = new ymaps.control.Button({ data : {
                    image : 'img/point11-xs.png'
                } }),
                isSelected = false,
                mapClickHandler = function(e) {
                    SXML.Project.Actions.createPoint(e.get('coords'));
                    pointButton.deselect();
                }
            
            pointButton.events.add('select', function() {
                map.events.add('click', mapClickHandler);
            });
            pointButton.events.add('deselect', function() {
                map.events.remove('click', mapClickHandler);
            });
            
            return pointButton;
        }
    
    },
    
    // Действия, подразумевающие запросы к серверу
    Actions : {
    
        // Точки
    
        // Создание новой точки без дополнительных данных
        createPoint : function(coords) {
            SXML.exec('create-point', {
                lat : coords[0],
                lon : coords[1],
                pr : SXML.Project.data.id
            }, function(returned) {
                SXML.greet({ sxml : { 'class' : 'point', item : returned } }, function(options) {
                    SXML.Project.openObjectBalloon(options.entity.map.uniqueId);
                    $(options.node).toggleClass('editing');
                }, this, true);
            });
        },
        
        // Редактирование точки (текстовые параметры)
        savePointData : function(p, name, descr, q) {
            SXML.exec('edit-point', {
                p : p,
                name : name,
                descr : descr,
                q : q
            }, function(returned) {
                SXML.greet({ sxml : { 'class' : 'point', item : p } }, function(options) {
                    SXML.Project.openObjectBalloon(options.entity.map.uniqueId);
                }, this, true);
            });
        },
        
        // Удаление точки
        deletePoint : function(p) {
            SXML.exec('delete-point', {
                p : p
            });
        },        
        
        // Комментарии
        
        // Отправляет комментарий в заданный тред. Обновляться будет само.
        postComment : function(threadId, text) {
            SXML.exec('thread.xml', 'post', {
                txt : text,
                trd : threadId
            });
        }
        
    },
    
    // Данные о проекте
    data : { }
    
    
};

SXML.greet({ sxml : { 'class' : 'project' } }, function(options) {
    SXML.Project.data.id = options.entity.sxml.item;
});

SXML.greet({ map : {} }, function(options) {
    SXML.Project.initMapObject(options.node, options.entity.map);
});

SXML.greet({ sxml : { 'class' : 'point' } }, function(options) {
    SXML.Project.initPointDOMElems(options.entity.sxml.item, options.node);
});

SXML.goodbye({ map : {} }, function(options) {
    SXML.Project.destroyMapObject(options.entity.map.uniqueId);
});

SXML.greet({ sxml : { 'class' : 'thread' } }, function(options) {
    SXML.Project.initPointThreadDOMElem(options.node);
});
/*
SXML.on('register', function(options) {
    // Запоминаем информацию о проекте
    if (options.entity.sxml['class'] == 'project') {
        SXML.Project.data.id = options.entity.sxml.item;
    }
    
    // Раскладываем точки по карте
    if (options.entity.map) {
        SXML.Project.initMapObject(options.node, options.entity.map);
    }
    if (options.entity.sxml['class'] == 'point') {
        SXML.Project.initPointDOMElems(options.node);
    }
});

SXML.on('unregister', function(options) {
    // Убираем точки с карты
    if (options.entity.map) {
        SXML.Project.destroyMapObject(options.entity.map.uniqueId);
    }
});*/

//------------

// Костыль для загрузки Я.Карт при xslt
function _init() {
    SXML.Project.init();
}