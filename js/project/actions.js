define(['sxml/sxml'], function(sxml) {

    return {
    
        // Проект
        
        renameProject : function(pr, name, callback) {
            sxml.exec('rename-project', {
                name : name,
                pr : pr
            });            
        },
        
        setProjectRights : function(pr, rights, callback) {
            sxml.exec('set-project-rights', {
                rights : rights,
                pr : pr
            });
        },
    
        // Точки
    
        // Создание новой точки без дополнительных данных
        createPoint : function(pr, coords, callback) {
            sxml.exec('create-point', {
                lat : coords[0],
                lon : coords[1],
                pr : pr
            }, function(returned) {
                sxml.greet({ sxml : { 'class' : 'point', item : returned, role : 'map' } }, callback, this, true);
            });
        },
        
        // Редактирование точки (текстовые параметры)
        savePointData : function(p, name, descr, q, marker, photos, callback) {
            sxml.exec('edit-point', {
                p : p,
                name : name,
                descr : descr,
                q : q,
                marker : marker,
                photos : photos
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