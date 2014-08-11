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
      this.subscribe();

      // Bind all socket events in this.socketEvents
      var self = this;
      this.socket = io();
      this.socket.on('connect', function () {
        self.socketEvents(self.socket);
      });

      // Report user as ready
      this.socket.emit('game/ready', token, {
        id: roomId,
        player1: p1,
        player2: p2
      });
    },

    subscribe: function () {
      this.pubsub.on('ws/attack', function (jutsu) {
        console.log('User wants to attack with', jutsu);
      });
    },

    // Handle all socket events
    socketEvents: function (socket) {
      var self = this;

      // The server acknowledged this user token and sent us the user info
      socket.on('game/logged', function (userinfo) {
        self.pubsub.trigger('logged', userinfo);
      });

      // The game can begin!
      socket.on('game/begin', function (players) {
        self.pubsub.trigger('begin', players);
      });
    }
  };

  return WS;
});
