SXML.Project = {

    _pendingMapObjects : {},
    _mapObjects : {},
    _mapReady : false,

    // ������������� �����
    initMap : function() {
    
        // ������ �����
        var map = SXML.Project.map = new ymaps.Map('project-map', {
            center: [55.79, 37.48], // ������
            zoom: 13
        });
        map.behaviors.enable('scrollZoom');
        
        // ��������� ��������
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
                    // TODO: IE ���������� range!!!
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
            
        // ����������� ������ ��� ������
        SXML.Project.balloonLayout = ymaps.templateLayoutFactory.createClass('$[[options.contentBodyLayout]]');
    
        SXML.Project._mapReady = true;
    },
    
    // ������������� �����
    initMapObject : function(node, mapData) {
        if (SXML.Project._mapReady) {
            var mapObject = new ymaps.Placemark([+mapData.lat, +mapData.lon], {
                balloonContentLayout : SXML.Project.balloonLayout,
                balloonContent : node
            }, SXML.Project.getIconSettings(SXML.Project.map.getZoom()));
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
    
    // �������� �����
    destroyMapObject : function(uniqueId) {
        if (SXML.Project._mapReady) {
            SXML.Project.map.geoObjects.remove(SXML.Project._mapObjects[uniqueId]);
            delete SXML.Project._mapObjects[uniqueId];
        } else {
            delete SXML.Project._pendingMapObjects[uniqueId];
        }
    },    
    
    // ���������� �������� ������ ��� ����� �� ����
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
        // TODO: �������!!!
    },
    
    // ������������� ���� �����, ������� ���������� �� ��������� �����
    initPendingObjects : function() {
        $.each(SXML.Project._pendingMapObjects, function(i, arr) {
            SXML.Project.initMapObject.apply(SXML.Project, arr);
            SXML.Project._pendingMapObjects[i] = null;
        });
    },
    
    // ��������� ����������� � ������
    initPointDOMElems : function(domElem) {
        // ��������-��������� ����� ��������������
        $(domElem).find('.point-edit-button').click(function(e) {
            $(this).closest('.point').toggleClass('editing');  
            e.preventDefault();
        });
        
        // ��������� �����, ���� ��� �� ������ �����������
        $(domElem).find('.point-comments:not(:has(.point-comment))').addClass('empty hidable hidden');
        
        // �������������-����������� ����������� �� �����, ���� ��� ����
        var nonEmpty = $(domElem).find('.point-comments:not(.empty)');
        nonEmpty.add(nonEmpty.prev('.point-comments-header')).click(function() {
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
        
        // ������� �������������-����������� ����� ���������� �� �����
        $(domElem).find('.point-comments.empty').prev('.point-comments-header').click(function() {
            $(this).next('.point-comments').toggleClass('hidden');
        });
        
        // ������ � ���� ����� �������� ������ �� ������� �����
        $(domElem).find('.point-comments-editor .point-comment-input').each(function() {  
            var m = $(this).prevAll('.point-comment-username').clone().css('opacity', 0).appendTo('body'),
                l = m[0].offsetWidth + 5;
            $(m).detach();
            $(this).css('text-indent', l + 'px');
        });
    },
    
    init : function() {
        SXML.Project.initMap();
        SXML.Project.initPendingObjects();
    },
    
    // ��������� ��� ��������� ���������
    Controls : {
    
        // ���������� ����� �����
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
    
    // ��������, ��������������� ������� � �������
    Actions : {
    
        // �������� ����� ����� ��� �������������� ������
        createPoint : function(coords) {
            SXML.exec('create-point', {
                lat : coords[0],
                lon : coords[1],
                pr : SXML.Project.data.id
            });
            var setPointCreator = function(data) {
                if (data.action == 'create-point') {
                    var opener = function(options) {
                        if (options.entity.sxml['class'] == 'point' && options.entity.sxml.item == data.returned) {
                            console.log('My balloon ' + data.returned + ' is here!');
                            SXML.un('register', opener);
                        }
                    };
                    SXML.on('register', opener);
                    SXML.un('actionComplete', setPointCreator);
                }
            };
            SXML.on('actioncomplete', setPointCreator);
        }
    
    },
    
    // ������ � �������
    data : { }
    
    
};

SXML.on('register', function(options) {
    // ���������� ���������� � �������
    if (options.entity.sxml['class'] == 'project') {
        SXML.Project.data.id = options.entity.sxml.item;
    }
    
    // ������������ ����� �� �����
    if (options.entity.map) {
        SXML.Project.initMapObject(options.node, options.entity.map);
    }
    if (options.entity.sxml['class'] == 'point') {
        SXML.Project.initPointDOMElems(options.node);
    }
});

SXML.on('unregister', function(options) {
    // ������� ����� � �����
    if (options.entity.map) {
        SXML.Project.destroyMapObject(options.entity.map.uniqueId);
    }
});

//------------

// ������� ��� �������� �.���� ��� xslt
function _init() {
    SXML.Project.init();
}