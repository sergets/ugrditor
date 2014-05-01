    require([
        'jquery',
        'sxml/sxml',
        'sxml/interface/rightsinput',
        'sxml/interface/fileinput',
        'sxml/interface/globalgallery',
        'js/utils/map',
        'js/project/points',
        'js/project/news',
        'js/project/controls',
        'js/project/actions',
        'js/project/rollouts',
        'js/utils/inputs'
    ], function(
        $,
        sxml,
        RightsInput,
        FileInput,
        gallery,
        Map,
        points,
        news,
        controls,
        actions,
        rollouts
    ) {

    var project = {

        initProjectDOMElems : function() {
            var viewRightsInput = new RightsInput($('.project-orgs .user-view-input'), this.data.orgs, { mutable : false }),
                editRightsInput = new RightsInput($('.project-orgs .user-edit-input'), this.data.orgs, { mutable : true }),
                h1 = $('h1'),
                renameForm = $('form.project-name-edit');
                
            $('.project-name-edit-button').click(function() {
                h1.toggleClass('editing');
            });
            $('.project-perms-edit-button').click(function() {
                $('.project-orgs').toggleClass('editing');
            });
            renameForm.submit(function() {
                actions.renameProject(project.data.id, renameForm.find('input').val());
                return false;
            });
            editRightsInput.on('change', function(e) {
                actions.setProjectRights(project.data.id, editRightsInput.val());
            });
        },
        
        init : function() {
            var map = this._map = new Map('project-map', [
                controls.createClicker({
                    image : 'img/point11-xs.png',
                    title : 'Поставить точку'
                }, function(coords) {
                    actions.createPoint(project.data.id, coords, function(options) {
                        project._map.openObjectBalloon(options.entity.map.uniqueId);
                        $(options.node).toggleClass('editing');
                    });
                }, project)
            ], [70, 0, 0, 0]);
            map.startGreeting(sxml);
            
            sxml.ready();
            map.reframe();
            points.setMap(map);

            news.on('refclick', function(data) {
                if (data.type == 'point') {
                    points.openOnMap(data.id);
                }
            });

            rollouts.on('gapschange', function(gaps) {
                map.setGaps(gaps);
            });
        },
        
        data : {}
       
    };

    sxml.greet({ sxml : { id : 'descr' } }, function(options) {
        project.data.id = options.entity.project.id;
        project.data.orgs = options.entity.project.orgs;
        project.initProjectDOMElems();
    });

    //------------

    // Костыль для загрузки Я.Карт при xslt
    window._init = function() {
        project.init();
    }

});