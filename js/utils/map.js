define([
        'jquery',
        'sxml/sxml',
        'sxml/utils/observable'
    ], function(
        $,
        sxml,
        Observable
    ) {
    
    var Map = function(elem, extControls, gaps) {
        this._objects = {};
        this._pendingObjects = {};
        Observable.apply(this, arguments);
        this.init(elem, extControls, gaps);
        return this;
    };

    Map.prototype = $.extend({}, Observable.prototype, {

        init : function(elem, extControls, gaps) {
            this._map = new ymaps.Map(elem, {
                center: [55.79, 37.48],
                zoom: 13
            });
            this._map.behaviors.enable('scrollZoom');
            this._gaps = gaps || [0, 0, 0, 0];
            this._addControls(extControls);
            this.setGaps(this._gaps);
            this._enableExpandingBalloons();
            this._ready = true;
            this._initPendingObjects();
        },
        
        _addControls : function(myControls) {
            var controls = [
                'mapTools',
                new ymaps.control.ToolBarSeparator(5)
            ];
            Array.prototype.push.apply(controls, myControls);
            this._toolbar = new ymaps.control.ToolBar(controls);
            this._typeSelector = new ymaps.control.TypeSelector;
            this._zoomControl = new ymaps.control.ZoomControl;
            this._map.controls
                .add(this._toolbar)
                .add(this._typeSelector)
                .add(this._zoomControl)
                .add('scaleLine');
        },
        
        setGaps : function(gaps) {
            this._gaps = gaps;
            this._toolbar.options.set('position', { top: this._gaps[0] + 5, left: this._gaps[1] + 5 });
            this._typeSelector.options.set('position', { top: this._gaps[0] + 5, right: this._gaps[3] + 5 });
            this._zoomControl.options.set('position', { top: this._gaps[0] + 45, left: this._gaps[1] + 5 })
        },
        
        _enableExpandingBalloons : function() {
            var map = this;
            this._map.balloon.events.add('open', function(b) {
                var balloon = b.get('balloon')
                    content = $(balloon.getOverlay().getElement()).find(':not(ymaps):eq(0)'),
                    height = content[0].offsetHeight;
                    
                map._balloonInterval = setInterval(function() {
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
            this._map.balloon.events.add('close', function() {
                clearInterval(map._balloonInterval);
            });
                
            // Тривиальный лейаут для балуна
            map._balloonLayout = ymaps.templateLayoutFactory.createClass('$[[options.contentBodyLayout]]');
        },
        
        initObject : function(node, mapData) {
            if (this._ready) {
                var mapObject = new ymaps.Placemark([+mapData.lat, +mapData.lon], {
                    balloonContentLayout : this._balloonLayout,
                    balloonContent : node,
                    hintContent : mapData.hint
                }, $.extend({}, this._getIconSettings(mapData.icon, this._map.getZoom()), {
                    draggable : !!mapData.draggable
                }));
                mapObject.events.add('balloonclose', $.proxy(function(e) {
                    this.trigger('balloonclose', node);
                }, this));
                mapObject.events.add('dragend', $.proxy(function(e) {
                    this.trigger('dragend', { node : node, coords : mapObject.geometry.getCoordinates() });
                }, this));
                this._map.geoObjects.add(mapObject);
                
                mapObject._onBoundsChange = $.proxy(function(e) {
                    var nz = e.get('newZoom');
                    if (nz != e.get('oldZoom')) {
                        mapObject.options.set(this._getIconSettings(mapData.icon, nz));
                    }
                }, this);
                this._map.events.add('boundschange', mapObject._onBoundsChange);
                this._objects[mapData.uniqueId] = mapObject;
            } else {
                this._pendingObjects[mapData.uniqueId] = arguments;
            }
        },
        
        // Убирание точки
        destroyObject : function(uniqueId) {
            if (this._ready) {
                this._map.events.remove('boundschange', this._objects[uniqueId]._onBoundsChange);
                this._map.geoObjects.remove(this._objects[uniqueId]);
                delete this._objects[uniqueId];
            } else {
                delete this._pendingObjects[uniqueId];
            }
        },

        // Инициализация всех точек, которые показались до появления карты
        _initPendingObjects : function() {
            $.each(this._pendingObjects, $.proxy(function(i, arr) {
                this.initObject.apply(this, arr);
                this._pendingObjects[i] = null;
            }, this));
        },
        
        // Открытие балуна на точке по айдишнику
        openObjectBalloon : function(uniqueId) {
            if (this._ready && this._objects[uniqueId]) {
                this._objects[uniqueId].balloon.open();
            }
        },           
        
        // Вычисление картинки значка для точки по зуму
        _getIconSettings : function(icon, zoom) {
            icon = icon || 'point11';
            if (zoom <= 12) return {
                iconImageHref : 'img/' + icon + '-s.png',
                iconImageSize : [20, 20],
                iconImageOffset : [-7, -17]
            };
            if (zoom >= 15) return {
                iconImageHref : 'img/' + icon + '-l.png',
                iconImageSize : [44, 44],
                iconImageOffset : [-15, -37]
            };
            return {
                iconImageHref : 'img/' + icon + '-m.png',
                iconImageSize : [30, 30],
                iconImageOffset : [-11, -25]
            }
            // TODO: спрайты!!!
        }, 
        
        startGreeting : function(sxml) {
            sxml.greet({ map : {} }, $.proxy(function(options) {
                this.initObject(options.node, options.entity.map);
            }, this));

            sxml.goodbye({ map : {} }, $.proxy(function(options) {
                this.destroyObject(options.entity.map.uniqueId);
            }, this));
        },
        
        setBounds : function() {
            this._map.setBounds.apply(this._map, arguments);
        },
        
        reframe : function() {
            this.setBounds(this._map.geoObjects.getBounds());
        }
    });
    
    return Map;
   
});