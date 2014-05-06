define([
    'jquery',  
    'sxml/sxml',
    'sxml/utils/observable',
    'sxml/notify',
    'sxml/interface/fileinput',
    'sxml/interface/globalgallery',
], function(
    $,
    sxml,
    Observable,
    notifier,
    FileInput,
    gallery
) {

    // BalloonForm
    
    var BalloonForm = function(options) {
        Observable.apply(this, arguments);
        this._domElem = options.node;
        this._entityData = options.entity[this._entitySection];

        this._init();
    }
    
    BalloonForm.prototype = $.extend({}, Observable.prototype, {
        _entitySection : '',
    
        _classes : {
            editorSwitch : '',
            editorForm : '',
            deleteButton : '',
            editing : '',
            confirmText : ''
        },
        
        _init : function() {
            this._initEditModeSwitch();
            this._initFormDeleteButton();
            this._initFormSubmit();
        },
        
        _initEditModeSwitch : function() {
            $(this._domElem).find('.' + this._classes.editorSwitch).click($.proxy(function(e) {
                $(this._domElem).toggleClass(this._classes.editing);
                e.preventDefault();
            }, this));
        },
        
        _initFormSubmit : function(options, formSelector, toggledClass, getData) {
            $(this._domElem).find('.' + this._classes.editorForm).submit($.proxy(function(e) {
                $(this._domElem).hasClass(this._classes.editing) && this.trigger('submit', this._serialize());
                e.preventDefault();
            }, this));
        },
        
        _initFormDeleteButton : function() {
            $(this._domElem).find('.' + this._classes.deleteButton).click(function(e) {
                notifier.confirm(this._classes.confirmText, function() {
                    this.trigger('delete', this._entityData.id);
                }, this);
            });
        },
        
        _serialize : function() {
            return {
                id : this._entityData.id
            }
        }
    });

    // MapObjectSet
    
    var MapObjectSet = function() {
        this._storage = {};
        this._map = null;
        this._entitySection = this._elemClass.prototype._entitySection;
        this._startGreeting(this._greetPattern);
    };
    
    MapObjectSet.prototype = {
        _elemClass : BalloonForm,
        
        _greetPattern : {},
        
        _actions : {
            submit : function(data) {
                // override
                this.openOnMap(data.id);
            },
            
            move : function(data) {
                // override
            },
            
            'delete' : function(id) {
                // override
            }
        },
    
        setMap : function(map) {
            this._map = map;
            map.on('balloonclose', $.proxy(function(node) {
                var data = this._getNodeData(node);
                if (data && data.empty === 'true') {
                    this._actions['delete'].call(this, data.id);
                }
            }, this));
            map.on('dragend', $.proxy(function(eventData) {
                var data = eventData.node && this._getNodeData(eventData.node);
                if (data) {
                    this._actions.move.call(this, {
                        id : data.id, 
                        coords : eventData.coords
                    });
                }
            }, this));
        },
        
        _getNodeData : function(node) {
            return node && sxml.getEntity(node) && sxml.getEntity(node)[this._entitySection];
        },        
        
        _startGreeting : function(pattern) { 
            sxml.greet({ sxml : pattern }, $.proxy(this._greetMapNode, this));
            sxml.goodbye({ sxml : pattern }, $.proxy(this._goodbyeMapNode, this));
        },
    
        _greetMapNode : function(options) {
            var id = options.entity.sxml.item,
                balloonForm = new this._elemClass(options);
            this._storage[id] = {
                mapId : options.entity.map.uniqueId,
                balloonForm : balloonForm
            };
            
            Object.keys(this._actions).forEach(function(action) {
                balloonForm.on(action, this._actions[action], this);
            }, this);
        },
        
        _goodbyeMapNode : function(options) {
            var id = options.entity.sxml.item,
                balloonForm = this._storage[id].balloonForm;
                
            Object.keys(this._actions).forEach(function(action) {
                balloonForm.un(action);
            });
            
            delete this._storage[id];
        },

        openOnMap : function(id) {
            this._storage[id] && this._map && this._map.openObjectBalloon(this._storage[id].mapId);
        }
    };
    
    // Rich balloon form
    
    var RichBalloonForm = function(options) {
        BalloonForm.apply(this, arguments);
    };
    
    RichBalloonForm.prototype = $.extend({}, BalloonForm.prototype, {
        _classes : {
            editorSwitch : '',
            editing : '',
            editorForm : '',
            deleteButton : '',
            photoView : '',
            photoEdit : '',
            markerControl : '',
            markerDropdown : '',
            markerDropdownElem : '',
            confirmText : ''
        },
        
        _markers : [],
        
        _init : function() {
            BalloonForm.prototype._init.apply(this, arguments);
            this._initPhotos();
            this._initMarkers();
        },
        
        _initPhotos : function() {
            this._photoView = new FileInput($(this._domElem).find('.' + this._classes.photoView), {
                val : this._entityData.photos,
                readOnly : true,
                onClick : function(hash, val) {
                    gallery.open(hash, val.split(' '));
                }
            });
            this._photoEdit = new FileInput($(this._domElem).find('.' + this._classes.photoEdit), {
                val : this._entityData.photos
            });
        },
        
        _initMarkers : function() {
            var markerControl = $(this._domElem).find('.' + this._classes.markerControl),
                dropdown = $(this._domElem).find('.' + this._classes.markerDropdown);
            this._currentMarker = this._entityData.marker;

            this._markers.forEach(function(id) {
                $('<img/>')
                    .attr('src', 'img/' + id + '-xs.png')
                    .addClass('.' + this._classes.markerDropdownElem)
                    .click($.proxy(function() {
                        this._currentMarker = id;
                        markerControl.attr('src', 'img/' + id + '-xs.png');
                        dropdown.addClass('hidden');
                    }, this))
                    .appendTo(dropdown);
            }, this);
            
            markerControl.click(function() {
                dropdown.toggleClass('hidden');
            });
        }
    });
    
    return {
        BalloonForm : BalloonForm,
        RichBalloonForm : RichBalloonForm,
        MapObjectSet : MapObjectSet
    };

});