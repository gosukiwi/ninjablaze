define(
  ['io', 'backbone', 'collections/users', 'models/user', 'backbone-modalview',  
   'jquery-cookie'], 
  function (io, Backbone, UsersCollection, User) {

  'use strict';

  return Backbone.View.extend({

    initialize: function (options) {

      // Online users
      // ---------------------------------------------------------------------
      this.collection = new UsersCollection();
      this.listenTo(this.collection, 'remove', this.onUserDC);
      this.listenTo(this.collection, 'add', this.onNewUser);

      // Current user
      // ---------------------------------------------------------------------
      this.selected = new User({ user: null });
      this.user = options.user;
      this.listenTo(this.selected, 'change', this.onSelectedChanged);

      // Duel-related stuff
      // ---------------------------------------------------------------------
      var self = this;
      this.modal = new Backbone.ModalPromptView({
        
        modalContent: 'Wanna duel bitchah BITCHA!?', 

        onButtonPressed: function (button) {
          if(button.data('name') === 'OK') {
            self.trigger('duel-yes');
          } else {
            self.trigger('duel-no');
          }
        }

      });

      this.on('duel-request', this.promptForDuel);
      this.on('duel-yes', this.acceptDuel);
      this.on('duel-no', this.denyDuel);
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

      socket.on('lobby/duel-start', function (players, roomId) {
        self.redirectToDuel(roomId);
      });

      socket.on('lobby/duel-declined', function (players) {
        self.modal.content(players.p2 + ' declined.');
        self.modal.prompt();
      });

      socket.on('lobby/duel-db-error', function () {
        self.modal.content('There has been an error with the database, please try again in a little while.');
        self.modal.prompt();
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
      var self = this;
      this.modal.prompt(function (err) {
        var players = {
          p1: enemy,
          p2: self.user.get('user')
        };

        self.modal.hide();

        if(err) {
          self.socket.emit('lobby/duel-no', players);
        } else {
          self.socket.emit('lobby/duel-yes', players);
        }
      });
    },

    // Redirects two players to the duels page
    redirectToDuel: function (roomId) {
      console.log(roomId);
      this.modal.content('You are now beeing redirected');
      // TODO: Don't use absolute path!
      window.location = '/duel/' + roomId;
    }

  });
});
