require([
        'jquery',
        'sxml/sxml',
        'sxml/interface/rightsinput',
        'sxml/interface/fileinput',
        'js/utils/inputs'
    ], function(
        $,
        sxml,
        RightsInput,
        FileInput
    ) {

    /* Форма добавления проекта */
    
    sxml.greet({ sxml : { class : 'project' } }, function(options) {
        var input = new RightsInput($(options.node).find('.orgs .userinput'), options.entity.project.orgs, { mutable : false });
        $(options.node).find('.button.delete').click(function() {
            sxml.Notifier.confirm('Удалить этот проект?', function() {
                sxml.exec('delete', {
                    project : options.entity.project.id
                });
            })
        })
    });    
    
    sxml.greet({ sxml : { id : 'projects' } }, function(options) {
        var form = $(options.node).find('.newprojectform'),
            rights = new RightsInput(form.find('.rightsinput'), sxml.data.user),
            cover = new FileInput(form.find('.fileinput'), { single : true });

        form.submit(function(e) {
            console.log('outer form submit!');
            sxml.exec('create', {
                name : $(this).find('input[name="name"]').val(),
                rights : rights.val(),
                descr : $(this).find('textarea[name="descr"]').val(),
                cover : cover.val()
            });
            e.preventDefault();
        });
    });
    
    sxml.ready();
    
});