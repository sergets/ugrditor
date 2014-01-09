define(function() {

    return {
        
        // Добавление новой точки
        createClicker : function(data, onclick, ctx) {
            var map = null,
                button = new ymaps.control.Button({ data : data }),
                isSelected = false,
                mapClickHandler = function(e) {
                    onclick.call(ctx, e.get('coords'));
                    button.deselect();
                }
            button.events.add('mapchange', function(e, data) {
                map && map.events.remove('click', mapClickHandler);
                map = e.originalEvent.newMap;
            });
            button.events.add('select', function() {
                map.events.add('click', mapClickHandler);
            });
            button.events.add('deselect', function() {
                map.events.remove('click', mapClickHandler);
            });
            
            return button;
        }
        
    }

});