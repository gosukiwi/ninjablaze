define(
  ['io', 'backbone', 'collections/users', 'models/user', 'jquery-cookie'], 
  function (io, Backbone, UsersCollection, User) {

  'use strict';

  return Backbone.View.extend({

    initialize: function (options) {
      this.collection = new UsersCollection();
      this.listenTo(this.collection, 'remove', this.onUserDC);
      this.listenTo(this.collection, 'add', this.onNewUser);

      this.selected = new User({ user: null });
      this.user = options.user;
      this.listenTo(this.selected, 'change', this.onSelectedChanged);

      this.on('duel-request', this.promptForDuel);
    },

    bindSocket: function (socket) {
      var self = this;

      self.socket = socket;

      // user is greeted
      socket.on('lobby/welcome', function (userdata) {
        var user = userdata.user;
        var online = userdata.online;

        self.user = new User(user);

        self.collection.add(user);
        online.forEach(function (user) {
          self.collection.add(user);
        });
      });

      // New user has connected
      socket.on('lobby/new-user', function (user) {
        self.collection.add(user);
      });

      // User dc'd
      socket.on('lobby/user-dc', function (user) {
        self.collection.remove(user);
      });

      socket.on('lobby/ask-for-duel', function (players) {
        self.trigger('duel-request', players.p1);
      });
    },

    events: {
      'click .online li': 'selectUser',
      'click .btn-duel': 'duelRequest'
    },

    // The user has clicked an user from the online list, mark as current
    selectUser: function (e) {
      var $el = $(e.currentTarget);
      var user = $el.data('user');
      if(user !== this.user.get('user')) {
        this.selected.set('user', user);
      }
    },

    onSelectedChanged: function () {
      this.$el.find('.selected-player').text(this.selected.get('user'));
    },

    // Request a duel with the selected user
    duelRequest: function () {
      var p1 = this.user.get('user');
      var p2 = this.selected.get('user');

      if(!p2) {
        console.log('Select a player!');
        return;
      }

      this.socket.emit('lobby/duel-request', {
        'p1': p1,
        'p2': p2
      });
    },

    onNewUser: function (user) {
      var $ul = this.$el.find('.online');
      var username = user.get('user');
      $ul.append('<li data-user="' + username + '">' + username + '</li>');
    },

    onUserDC: function (user) {
      this.$el.find('[data-user=' + user.get('user') + ']').remove();
    },

    promptForDuel: function (enemy) {
      console.log('yo, ', enemy, ' wants to duel!');
    }

  });
});
