define(['sxml/sxml'], function(sxml) {

    return {
    
        // Точки
    
        // Создание новой точки без дополнительных данных
        createPoint : function(coords, map, callback) {
            sxml.exec('create-point', {
                lat : coords[0],
                lon : coords[1],
                pr : project.data.id
            }, function(returned) {
                sxml.greet({ sxml : { 'class' : 'point', item : returned, role : 'map' } }, callback, this, true);
            });
        },
        
        // Редактирование точки (текстовые параметры)
        savePointData : function(p, name, descr, q, callback) {
            sxml.exec('edit-point', {
                p : p,
                name : name,
                descr : descr,
                q : q
            }, function(returned) {
                sxml.greet({ sxml : { 'class' : 'point', item : p, role : 'map' } }, callback, this, true);
            });
        },
        
        // Удаление точки
        deletePoint : function(p) {
            sxml.exec('delete-point', {
                p : p
            });
        },        
        
        // Удаление точки
        movePoint : function(p, coords) {
            sxml.exec('move-point', {
                p : p,
                lat : coords[0],
                lon : coords[1]                
            });
        },            
        
        // Комментарии
        
        // Отправляет комментарий в заданный тред. Обновляться будет само.
        postComment : function(threadId, text) {
            sxml.exec('thread.xml', 'post', {
                txt : text,
                trd : threadId
            });
        }
        
    };
    
});