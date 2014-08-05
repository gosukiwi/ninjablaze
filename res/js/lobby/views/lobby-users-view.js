define(
  ['io', 'backbone', 'collections/messages', 'models/user', 
   'collections/users', 'jquery-cookie'], 
  function (io, Backbone, Messages, User, Users) {

  'use strict';

  return Backbone.View.extend({
    initialize: function (users) {
      this.listenTo(this.collection, 'add', this.onNewUser);
    },

    bindSockets: function (socket) {
    },

    render: function () {
      return this;
    }
  });
});
