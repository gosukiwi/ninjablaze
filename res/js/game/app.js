/**
 * Main game application, two players battle it out!
 */
define(['jquery', 'backbone', 'underscore', 'ws', 'helpers/layout',
        'views/jutsu-menu-view', 'views/hp-view', 'views/jutsu-view',
        'models/user'], 
    function ($, Backbone, _, ws, Layout, JutsuMenuView, HPView, 
      JutsuView, User) {

  'use strict';

  var pubsub = _.extend({}, Backbone.Events);

  return {

    Initialize: function () {
      // Initialize web sockets
      ws.initialize(pubsub);

      // Get current user
      var user = new User({ id: 1 });
      user.fetch();

      // Layout definition
      var layout = new Layout();

      layout.add(JutsuView, { 
        el: '#info-panel',
        model: new Backbone.Model({})
      });

      layout.add(JutsuMenuView, {
        el: '#jutsu-menu',
        collection: user.jutsus
      });

      layout.add(HPView, {
        el: '#player-1-hp',
        model: user
      });

      layout.render();

      // Communicate between layout and web sockets
      layout.on('attack', function (jutsu) {
        pubsub.trigger('attack', jutsu);
      });
    }

  };

});
