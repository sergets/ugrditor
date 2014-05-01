define([
    'sxml/sxml',
    'sxml/utils/observable'
], function(
    sxml,
    Observable
) {
    var rolloutsObservable = new Observable(),
        rollouts = {},
        activeRollout = null,
        waitingRollout = null;

    sxml.greet({ rollout : { role : 'header' } }, function(options) {
        greet(options.entity.rollout.id, {
            header : options.node
        });
    });
    
    sxml.greet({ rollout : { role : 'rollout' } }, function(options) {
        greet(options.entity.rollout.id, {
            rollout : options.node,
            width : options.node.offsetWidth
        });
    });
    
    sxml.goodbye({ rollout : { role : 'header' } }, function(options) {
        goodbye(options.entity.rollout.id, {
            header : null,
            done : false
        });
    });

    sxml.goodbye({ rollout : { role : 'rollout' } }, function(options) {
        goodbye(options.entity.rollout.id, {
            rollout : null,
            done : false
        });
    });
    
    function greet(id, record) {
        rollouts[id] = $.extend({}, rollouts[id], record);
        updateRollouts();        
    }
    
    function goodbye(id, record) {
        if (activeRollout == id && !waitingRollout) {
            close();
            waitingRollout = id;
        }
        rollouts[id].header && $(rollouts[id].header).unbind('click');
        $.extend(rollouts[id], record);
        updateRollouts();   
    }

    function updateRollouts() {
        $.each(rollouts, function(id, record) {
            if (!record.done && record.rollout && record.header) {
                $(record.header).click(function() {
                    if(activeRollout == id) {
                        close();
                    } else {
                        open(id);
                    }
                })
                record.done = true;
                if (id == waitingRollout) {
                    waitingRollout = null;
                    open(id);
                }
            }
        })
    }
    
    function open(id) {
        if (rollouts[id] && rollouts[id].done) {
            close();
            activeRollout = id;
            $(rollouts[activeRollout].rollout).addClass('open');
            $(rollouts[activeRollout].header).addClass('selected');
            rolloutsObservable.trigger('gapschange', [70, rollouts[activeRollout].width, 0, 0]);
        }
    }
    
    function close() {
        if (activeRollout && rollouts[activeRollout] && rollouts[activeRollout].done) {
            $(rollouts[activeRollout].rollout).removeClass('open');
            $(rollouts[activeRollout].header).removeClass('selected');
            rolloutsObservable.trigger('gapschange', [70, 0, 0, 0]);
            activeRollout = null;                
        }
    }
    
    return rolloutsObservable;
});