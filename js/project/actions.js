define(['sxml/sxml'], function(sxml) {

    return {
    
        // �����
    
        // �������� ����� ����� ��� �������������� ������
        createPoint : function(coords, map, callback) {
            sxml.exec('create-point', {
                lat : coords[0],
                lon : coords[1],
                pr : project.data.id
            }, function(returned) {
                sxml.greet({ sxml : { 'class' : 'point', item : returned, role : 'map' } }, callback, this, true);
            });
        },
        
        // �������������� ����� (��������� ���������)
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
        
        // �������� �����
        deletePoint : function(p) {
            sxml.exec('delete-point', {
                p : p
            });
        },        
        
        // �������� �����
        movePoint : function(p, coords) {
            sxml.exec('move-point', {
                p : p,
                lat : coords[0],
                lon : coords[1]                
            });
        },            
        
        // �����������
        
        // ���������� ����������� � �������� ����. ����������� ����� ����.
        postComment : function(threadId, text) {
            sxml.exec('thread.xml', 'post', {
                txt : text,
                trd : threadId
            });
        }
        
    };
    
});