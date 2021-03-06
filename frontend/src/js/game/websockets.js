/**
 * Web sockets handling
 */
define(['io', 'jquery-cookie'], function (io) {
  'use strict';

  // Read data from the duel page markup
  var $duelContainer = $('.duel');
  var roomId = $duelContainer.data('id');
  var p1 = $duelContainer.data('p1');
  var p2 = $duelContainer.data('p2');

  // Read the token from our cookie, the browser would have redirected by
  // now if the cookie was empty
  var token = $.cookie('token');

  var WS = {
    initialize: function (pubsub) {
      // Save the pubsub instance, we use this to communicate with the Backbone
      // views
      this.pubsub = pubsub;
      this.subscribeUI();

      // Bind all socket events in this.subscribeWS on connection
      var self = this;
      this.socket = io();
      this.socket.on('connect', function () {
        self.subscribeWS(self.socket);
      });

      // Report user as ready
      this.socket.emit('game/ready', token, {
        id: roomId,
        player1: p1,
        player2: p2
      });
    },

    // subscribe to UI events
    subscribeUI: function () {
      var self = this;

      // The user wants to attack! Emit a socket event
      this.pubsub.on('ws/attack', function (jutsu, user) {
        self.socket.emit('game/attack', jutsu.toJSON(), roomId, user.toJSON());
      });
    },

    // Handle all socket events in here, and using pubsub all views can
    // subscribe as needed.
    subscribeWS: function (socket) {
      var self = this;

      // The game can begin! players is a pojo with both players, and turn is
      // either the string 'p1' or 'p2'.
      socket.on('game/begin', function (userinfo, players, turn) {
        self.pubsub.trigger('server/begin', userinfo, players, turn);
      });

      // The turn finished, we got the current state of the game
      socket.on('game/turn-finished', function (state) {
        self.pubsub.trigger('server/turn-finished', state);
      });

      // Turn changed
      socket.on('game/turn', function (turn) {
        self.pubsub.trigger('server/turn', turn);
      });

      // Game over!
      socket.on('game/game-over', function (winner) {
        self.pubsub.trigger('server/game-over', winner);
      });
    }
  };

  return WS;
});
