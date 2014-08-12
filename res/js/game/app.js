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

      // When the user is successfully logged in, bind the layout events and
      // render the views
      var self = this;

      this.layout.on('attack', function (jutsu) {
        self.layout.trigger('ws/attack', jutsu);
      });

      // When the game begins, hide the overlay and if it's the player turn
      // display jutsus, if not, hide.
      this.layout.on('begin', function (userinfo, players, turn) {
        self.user = new User({ id: userinfo.id });
        self.user.fetch().then(function () {
          self.layout.trigger('ws/user-loaded', self.user);
          self.renderViews();

          if((+self.user.get('id')) === (+players.p1.id)) {
            self.player = 'p1';
          } else {
            self.player = 'p2';
          }

          console.log('turn is', turn, 'and im', self.player);
          if(turn === self.player) {
            console.log('trigger enter turn');
            self.layout.trigger('enter-turn');
          } else {
            console.log('trigger leave turn');
            self.layout.trigger('leave-turn');
          }

        });
      });



      // Web Sockets
      // ---------------------------------------------------------------------
      // Initialize web sockets, pass the layout as argument for the pubsub
      // implementation.
      WS.initialize(this.layout);
    },

    // Get current user and render all the views for that user
    renderViews: function () {
      console.log('render views');
      this.layout.add(JutsuView, { 
        el: '#info-panel',
        model: new Backbone.Model({})
      });

      this.layout.add(JutsuMenuView, {
        el: '#jutsu-menu',
        collection: this.user.jutsus
      });

      this.layout.add(HPView, {
        el: '#player-1-hp',
        model: this.user
      });

      this.layout.render();

      // Trigger an user-loaded event so the WebSocket can get the user
      //this.layout.trigger('ws/user-loaded', user);
    }

  };

});
