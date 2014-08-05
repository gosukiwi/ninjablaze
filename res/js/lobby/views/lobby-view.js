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

      // Get user, this would be from server, for now just create a User object
      self.users = new Users();
      self.listenTo(self.users, 'remove', self.onUserDC);
      self.listenTo(self.users, 'add', self.onNewUser);

      // Sub views
      var users = new UsersView({ collection: self.users });
      this.$el.find('.loby-info').html(users.render().el);

      // Socket initialization
      self.socket = io();
      self.socket.on('connect', function () {
        self.bindSockets();
        users.bindSockets(self.socket);
      });
    },

    // Bind to all possible sockets for the lobby view, this is part of the
    // initialize process.
    bindSockets: function () {
      var self = this;
      var token = $.cookie('token');

      // User seems ok, receive welcome message
      self.socket.on('lobby/welcome', function (userdata) {
        var user = userdata.user;
        var online = userdata.online;

        self.user = new User(user);
        self.users.add(user);

        online.forEach(function (user) {
          self.users.add(user);
        });
      });

      // New user has connected
      self.socket.on('lobby/new-user', function (user) {
        self.users.add(user);
      });

      // User dc'd
      self.socket.on('lobby/user-dc', function (user) {
        self.users.remove(user);
      });

      // On new message, trigger the new-msg event
      self.socket.on('lobby/new-msg', function (msg) {
        self.messages.add(msg);
      });


      self.socket.emit('lobby/auth', { token: token });
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
    },

    onNewUser: function (user) {
      var $ul = this.$el.find('.online');
      var username = user.get('user');
      $ul.append('<li data-user="' + username + '">' + username + '</li>');
    },

    onUserDC: function (user) {
      this.$el.find('[data-user=' + user.get('user') + ']').remove();
    }
  });
});
