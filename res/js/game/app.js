/**
 * Main game application, two players battle it out!
 */
define(['jquery', 'backbone', 'underscore', 'ws', 'helpers/layout',
        'views/jutsu-menu-view', 'views/hp-view', 'views/jutsu-view',
        'models/user'], 
    function ($, Backbone, _, WS, Layout, JutsuMenuView, HPView, 
      JutsuView, User) {

  'use strict';

  return {

    initialize: function () {
      // Layout definition
      this.layout = new Layout();
      var self = this;

      // Events
      this.layout.on('logged', function (userdata) {
        // Once the user is logged and we get the user data, we can render the
        // jutsus and all related views
        self.renderViews(userdata);
      });

      // Communicate between layout and web sockets
      this.layout.on('attack', function (jutsu) {
        self.layout.trigger('ws/attack', jutsu);
      });

      // Initialize web sockets, pass the layout as argument for the pubsub
      // implementation.
      WS.initialize(this.layout);
    },

    renderViews: function (userdata) {
      // Get current user and render all the views for that user
      var user = new User({ id: userdata.id });
      var self = this;
      user.fetch().then(function () {
        self.layout.add(JutsuView, { 
          el: '#info-panel',
          model: new Backbone.Model({})
        });

        self.layout.add(JutsuMenuView, {
          el: '#jutsu-menu',
          collection: user.jutsus
        });

        self.layout.add(HPView, {
          el: '#player-1-hp',
          model: user
        });

        self.layout.render();
      });
    }

  };

});
