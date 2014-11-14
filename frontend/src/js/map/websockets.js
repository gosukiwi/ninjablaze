/**
 * Web sockets handling
 */
define(['io'], function (io) {
  'use strict';

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
    },

    // subscribe to UI events
    subscribeUI: function () {
      var self = this;

      // The user wants to attack! Emit a socket event
      this.pubsub.on('ui/get-npcs', function (pos) {
        self.socket.emit('map/get-npcs', pos[0], pos[1]);
      });
    },

    // Handle all socket events in here, and using pubsub all views can
    // subscribe as needed.
    subscribeWS: function (socket) {
      var self = this;

      // The game can begin! players is a pojo with both players, and turn is
      // either the string 'p1' or 'p2'.
      socket.on('map/npc-list', function (npcs) {
        self.pubsub.trigger('server/npc-list', npcs);
      });
    }
  };

  return WS;
});
