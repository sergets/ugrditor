require([
        'jquery',
        'sxml/sxml',
        'js/utils/inputs'
    ], function(
        $,
        sxml
    ) {

    /* ����� ���������� ������� */

    sxml.greet({ sxml : { id : 'projects' } }, function(options) {
        $(options.node).find('.newprojectform').submit(function(e) {
            sxml.exec('create', {
                name : $(this).find('input[name="name"]').val(),
                descr : $(this).find('textarea[name="descr"]').val()
            });
            e.preventDefault();
        });
    });
    
    sxml.ready();
    
});