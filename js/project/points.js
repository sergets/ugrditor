define([
    'jquery',  
    'sxml/sxml',
    'sxml/interface/rightsinput',
    'sxml/interface/fileinput',
    'sxml/interface/globalgallery',
    'js/project/actions'
], function(
    $,
    sxml,
    RightsInput,
    FileInput,
    gallery,
    actions
) {
    var points = {
        _map : null,
        _storage : {},
    
        setMap : function(map) {
            this._map = map;
            map.on('balloonclose', $.proxy(this._onPointBalloonClose, this));
            map.on('dragend', $.proxy(this._onPointDragEnd, this));            
        },
    
        // ��������� ����������� � ������
        _initMapPointDOMElems : function(entity, domElem) {
            var id = entity.sxml.item;
            
            this._storage[id] = entity.map.uniqueId;

            // ��������-��������� ����� ��������������
            $(domElem).find('.point-edit-button').click(function(e) {
                $(this).closest('.point').toggleClass('editing');  
                e.preventDefault();
            })

            var photoView = new FileInput($(domElem).find('.point-view-photos'), {
                    val : entity.point.photos,
                    readOnly : true,
                    onClick : function(hash, val) {
                        gallery.open(hash, val.split(' '));
                    }
                }),
                photoEdit = new FileInput($(domElem).find('.point-edit-photos'), {
                    val : entity.point.photos
                });
                
            // ����� ����� ������� � �����
            var markers = [ 'point10', 'point11', 'point12', 'point20', 'point21', 'point22', 'point13', 'point3', 'point0' ],
                markerControl = $(domElem).find('.point-edit-marker'),
                dropdown = $(domElem).find('.point-marker-dropdown'),
                marker = entity.point.marker;

            markers.forEach(function(id) {
                $('<img/>')
                    .attr('src', 'img/' + id + '-xs.png')
                    .addClass('.point-marker-dropdown-elem')
                    .click(function() {
                        marker = id;
                        markerControl.attr('src', 'img/' + id + '-xs.png');
                        dropdown.addClass('hidden');
                    })
                    .appendTo(dropdown);
            });
            
            markerControl.click(function() {
                dropdown.toggleClass('hidden');
            });

            // ����������
            $(domElem).find('.point-editor').submit(function(e) {
                $(this).closest('.point').hasClass('editing') && actions.savePointData(
                    id,
                    $(domElem).find('.point-title-input').val(),
                    $(domElem).find('textarea.text').val(),
                    $(domElem).find('textarea.question').val(),
                    marker,
                    photoEdit.val(),
                    function() {
                        points.openOnMap(id);
                    }
                );
                e.preventDefault();
            });
            
            // ��������
            $(domElem).find('.point-delete-button').click(function(e) {
                sxml.Notifier.show(
                    $('<div/>')
                        .html('������ ������� ��� �����? ')
                        .append($('<a/>')
                            .html('��')
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
        
        // ��������� ����������� � ������
        _initListPointDOMElems : function(id, domElem) {
            // ��������-��������� ����� ��������������
            $(domElem).find('.map-link').click(function() {
                points.openOnMap(id);
            });
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
        
        _initPointThreadDOMElem : function(domElem) {
            // ��������� �����, ���� ��� �� ������ �����������, �������������-����������� ����������� �� �����, ���� ��� ����
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
            
            // ������ � ���� ����� �������� ������ �� ������� �����
            $(domElem).find('.point-comments-editor .point-comment-input').each(function() {  
                var m = $(this).prevAll('.point-comment-username').clone().css('opacity', 0).appendTo('body'),
                    l = m[0].offsetWidth + 5;
                $(m).detach();
                $(this).css('text-indent', l + 'px');
            });
            
            // ������ ���� �� ���� ����� ��������
            $(domElem).find('.point-comments-editor').submit(function(e) {
                actions.postComment($(this).closest('.point-comments-thread')[0].ondblclick().thread.id, $(this).find('.point-comment-input').val());
                e.preventDefault();
            });
        },

        openOnMap : function(id) {
            this._storage[id] && this._map && this._map.openObjectBalloon(this._storage[id]);
        }
    };
    
    sxml.greet({ sxml : { 'class' : 'point', role : 'map' } }, function(options) {
        points._initMapPointDOMElems(options.entity, options.node);
    });
    
    sxml.greet({ sxml : { 'class' : 'point', role : 'list' } }, function(options) {
        points._initListPointDOMElems(options.entity.sxml.item, options.node);
    });    

    sxml.greet({ sxml : { 'class' : 'thread' } }, function(options) {
        points._initPointThreadDOMElem(options.node);
    });
    
    return points;
});