/* ����� ���������� ������� */

$('.newprojectform').submit(function(e) {
    SXML.exec('create', {
        name : $(this).find('input[name="name"]').val(),
        descr : $(this).find('textarea[name="descr"]').val()
    });
    e.preventDefault();
});