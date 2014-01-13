require([
        'jquery',
        'sxml/sxml',
        'sxml/interface/rightsinput',
        'js/utils/inputs'
    ], function(
        $,
        sxml,
        RightsInput
    ) {

    /* Форма добавления проекта */

    sxml.greet({ sxml : { id : 'projects' } }, function(options) {
        var form = $(options.node).find('.newprojectform'),
            rights = new RightsInput(form.find('.rightsinput'), sxml.data.user);

        console.log(RightsInput);

        
        form.submit(function(e) {
            sxml.exec('create', {
                name : $(this).find('input[name="name"]').val(),
                rights : rights.val(),
                descr : $(this).find('textarea[name="descr"]').val()
            });
            e.preventDefault();
        });
    });
    
    sxml.ready();
    
});