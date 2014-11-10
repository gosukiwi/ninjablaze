/**
 * NINJA BLAZE
 * Game entry point, two players battle it out!
 */
define([
      'jquery', 
      'backbone', 
      'underscore', 
      'websockets', 
      'helpers/layout',
      'views/jutsu-menu-view', 
      'views/hp-view', 
      'views/jutsu-view',
      'views/log-view',
      'models/user',
      'collections/log-messages',
      'animations/attack'
    ], 
    function (
      $, 
      Backbone, 
      _, 
      WebSockets, 
      Layout, 
      JutsuMenuView, 
      HPView, 
      JutsuView, 
      LogView,
      User,
      LogMessages,
      attackAnimation
) {
  'use strict';

  return {

    initialize: function () {
      // Layout definition
      this.layout = new Layout();

      // When the user is successfully logged in, bind the layout events and
      // render the views
      var self = this;

      // All events in the "server" namespace are received from the server,
      // others are generated locally in the UI.
      this.layout.on('ui/attack', function (jutsu) {
        // The "ws" event namespace is to send websocket events, handled in
        // websockets.js
        self.layout.trigger('ws/attack', jutsu, self.user);
      });

      // Game over! GG.
      this.layout.on('server/game-over', function (winner) {
        if(winner === self.player) {
          // TODO: Modal
          console.log('YOU WIN!');
        } else {
          // TODO: Modal
          console.log('YOU LOSE!');
        }

        window.location = '/lobby';
      });

      this.layout.on('server/turn-finished', function (state) {
        // First do animations and display messages
        console.log('Turn ended! The state is', state);
        var playerstate = state[self.player];
        self.layout.trigger('ui/attacked', playerstate.damageDealt, playerstate.currentHP);

        // TODO: Remove this
        // Test animation for attack
        attackAnimation($('#local-avatar'), $('#remote-avatar'))
        .then(function () {
          // Add log messages
          var message = 'First player delt ' + state[state.first].damageDealt + ' damage';
          self.layout.trigger('ui/log-message', { type: 'normal', message: message });

          // Send next animation
          return attackAnimation($('#remote-avatar'), $('#local-avatar'));
        })
        .then(function () {
          // Add log messages
          var message = 'Second player attacked!';
          self.layout.trigger('ui/log-message', { type: 'normal', message: message });

          // Finally enter turn again
          self.layout.trigger('ui/enter-turn');
        });
      });

      // When the game begins, hide the overlay and if it's the player turn
      // display jutsus, if not, hide.
      this.layout.on('server/begin', function (player_num, players, state) {
        console.log('Trigger server/begin');

        // Get the local player data
        var user = players[player_num];
        // Fetch player info and jutsus from the API
        self.user = new User({ id: user.userinfo.id });
        self.user.fetch().then(function () {
          self.user.set('currentHP', user.currentHP);
          self.initializeViews();
          self.player = player_num;

          self.layout.trigger('ui/log-message', { type: 'normal', message: 'Connected!' });

          console.log('status is', state[self.player]);
          if(state[self.player].status === 'waiting') {
            console.log('trigger enter turn');
            self.layout.trigger('ui/enter-turn');
          } else {
            console.log('trigger leave turn');
            self.layout.trigger('ui/wait-turn');
          }
        });
      });


      // Web Sockets
      // ---------------------------------------------------------------------
      // Initialize web sockets, pass the layout as argument for the pubsub
      // implementation.
      WebSockets.initialize(this.layout);
    },

    // Get current user and render all the views for that user
    initializeViews: function () {
      console.log('render views');
      this.layout.add(JutsuView, { 
        el: '#info-panel',
        model: new Backbone.Model({})
      });

      this.layout.add(JutsuMenuView, {
        el: '#jutsu-menu',
        collection: this.user.jutsus
      });

      var startingLog = new LogMessages([{ type: 'info', message: 'Loading...' }]);
      this.layout.add(LogView, {
        el: '.log',
        collection: startingLog
      });

      this.layout.add(HPView, {
        el: '#player-1-hp',
        model: this.user
      });

      this.layout.render();
    }

  };

});
