/* global define */
/**
 * Main game application, two players battle it out!
 */
define(['jquery', 'backbone', 'underscore', 'views/user-ui-view', 'ws', 'helpers/region-manager',
        'views/jutsu-menu-view', 'views/hp-view', 'views/info-view'], 
    function ($, Backbone, _, UserUIView, ws, RegionManager, JutsuMenuView, HPView, InfoView) {

  'use strict';

  var pubsub = _.extend({}, Backbone.Events);

  return {

    Initialize: function () {
      // Initialize web sockets
      ws.initialize(pubsub);

      // Regions
      var manager = new RegionManager();
      manager.add(InfoView, { el: '#info-panel' });
      manager.add(JutsuMenuView, {
        el: '#jutsu-menu',
        // TODO: This should be a collection
        model: [
          {
            name: 'Gokakyou no jutsu',
            damage: 200,
            element: 'fire',
            type: 'ninjutsu',
            description: 'Some desc...'

          },
          {
            name: 'Replacemente jutsu',
            damage: 200,
            element: 0,
            type: 'ninjutsu',
            description: 'Some desc...'
          },
          {
            name: 'Throw Kunai',
            damage: 200,
            element: 0,
            type: 'taijutsu',
            description: 'Some desc...'
          },
          {
            name: 'Body Flicker',
            damage: 200,
            element: 0,
            type: 'ninjutsu',
            description: 'Some desc...'
          }
        ]
      });

      manager.add(HPView, {
        el: '#player-1-hp',
        model: {
          'name': 'gosukiwi',
          'str': 10,
          'agi': 10,
          'int': 10,
          'chakranature': 'water',
          'hp': 2500,
          'currentHp': 1600,
          'level': 10,
        }      
      });

      manager.render();
    }

  };

});
