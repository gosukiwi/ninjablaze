define(
  ['io', 'backbone', 'collections/messages', 'models/user', 
   'collections/users', 'views/lobby-users-view', 'jquery-cookie'], 
  function (io, Backbone, Messages, User, Users, UsersView) {

  'use strict';

  var ENTER_KEY = 13;

  return Backbone.View.extend({
    el: '#lobby',

    // This element gets used on each insert so let's cache it so jQuery
    // doesn't have to find it on each new message.
    $ul: $('.lobby-chat').find('.chat'),

    initialize: function () {
      var self = this;

      // Messages collection
      self.messages = new Messages();
      self.listenTo(self.messages, 'add', self.onNewMsg);

      // Sub views
      var users_view = new UsersView({ 
        el: '.lobby-info'
      });

      // Socket initialization
      self.socket = io();
      self.socket.on('connect', function () {
        users_view.bindSocket(self.socket);
        self.bindSocket(self.socket);
      });
    },

    // Bind to all possible sockets for the lobby view, this is part of the
    // initialize process.
    bindSocket: function (socket) {
      var self = this;
      var token = $.cookie('token');

      // User seems ok, receive welcome message
      socket.on('lobby/welcome', function (userdata) {
        var user = userdata.user;
        self.user = new User(user);
      });

      // On new message, trigger the new-msg event
      socket.on('lobby/new-msg', function (msg) {
        self.messages.add(msg);
      });

      socket.emit('lobby/auth', { token: token });
    },

    events: {
      'keydown .lobby-chat textarea': function (e) {
        var $ta = $(e.currentTarget),
            val,
            message;

        if(e.keyCode === ENTER_KEY) {
          e.preventDefault();
          val = $ta.val();

          if(!val) {
            return;
          }

          $ta.val('');
          message = { msg: val, author: this.user.toJSON() };
          this.messages.add(message);
          this.socket.emit('lobby/msg', message);
        }
      }
    },

    onNewMsg: function (msg) {
      var username = msg.get('author').user;
      var message = msg.get('msg');
      this.$ul
        .append('<li><span class="username">' + username + 
            '</span> <span class="message">' + message + '</span></li>')
        .scrollTop(this.$ul.outerHeight());
    }

  });
});
