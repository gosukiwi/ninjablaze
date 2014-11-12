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

  function getUserFromNumber(num) {
    if(num === app.player) {
      return app.user;
    }

    return app.enemy;
  }

  function setupGame(player_num, players, state) {
    // Get the local player data
    var user = players[player_num];

    // Enemy data, in the format
    // {
    //   hp: int,
    //   currentHP: int,
    //   userinfo: object
    // }
    var enemy = players[player_num === 'p1' ? 'p2' : 'p1'];
    app.enemy = new User({ 
      id: enemy.userinfo.id,
      user: enemy.userinfo.user,
      hp: enemy.hp,
      currentHP: enemy.currentHP
    });

    // Fetch player info and jutsus from the API
    app.user = new User({ id: user.userinfo.id });
    app.user.fetch().then(function () {
      app.user.set('currentHP', user.currentHP);
      app.initViews();

      // Save the players numbers
      app.player = player_num;

      // Log a welcome message
      app.layout.trigger('ui/log-message', { type: 'normal', message: 'Connected!' });

      if(state[app.player].status === 'waiting') {
        app.layout.trigger('ui/enter-turn');
      } else {
        app.layout.trigger('ui/wait-turn');
      }
    });
  }

  function attack(jutsu) {
    // The "ws" event namespace is to send websocket events, handled in
    // websockets.js
    app.layout.trigger('ws/attack', jutsu, app.user);
  }

  function gameOver (winner) {
    if(winner === app.player) {
      // TODO: Modal
      console.log('YOU WIN!');
    } else {
      // TODO: Modal
      console.log('YOU LOSE!');
    }

    window.location = '/lobby';
  }

  function doTurn(state) {
    // First do animations and display messages
    console.log('Turn ended! The state is', state);
    var playerstate = state[app.player];
    var enemystate  = state[app.player === 'p1' ? 'p2' : 'p1'];

    var firstPlayer  = getUserFromNumber(state.first);
    var secondPlayer = getUserFromNumber(state.second);

    // TODO: Remove this
    // Test animation for attack
    attackAnimation($('#local-avatar'), $('#remote-avatar'))
    .then(function () {
      // Add log messages
      var message = firstPlayer.get('user') + ' attacked with ' + state[state.first].jutsuUsed.name;
      app.layout.trigger('ui/log-message', { type: 'normal', message: message });

      if(state.first === app.player) {
        app.user.set('currentHP', playerstate.currentHP);
      } else {
        app.enemy.set('currentHP', enemystate.currentHP);
      }

      // Send next animation
      return attackAnimation($('#remote-avatar'), $('#local-avatar'));
    })
    .then(function () {
      // Add log messages
      var message = secondPlayer.get('user') + ' attacked with ' + state[state.second].jutsuUsed.name;
      app.layout.trigger('ui/log-message', { type: 'normal', message: message });

      if(state.second === app.player) {
        app.user.set('currentHP', playerstate.currentHP);
      } else {
        app.enemy.set('currentHP', enemystate.currentHP);
      }

      // Finally enter turn again
      app.layout.trigger('ui/enter-turn');
    });

    app.layout.trigger('ui/enter-turn');
  }

  // Application obejct, handle views, web sockets and layout events
  var app = {

    // set up layout, subscribe to it's events and initialize websockets 
    initialize: function () {
      // Layout definition
      this.layout = new Layout();

      // Subscribe to layout events
      this.subscribe();

      // Web Sockets
      // ---------------------------------------------------------------------
      // Initialize web sockets, pass the layout as argument for the pubsub
      // implementation.
      WebSockets.initialize(this.layout);
    },

    subscribe: function () {
      // All events in the "server" namespace are received from the server,
      // others are generated locally in the UI.
      this.layout.on('ui/attack', attack);

      // Game over! GG.
      this.layout.on('server/game-over', gameOver);

      // The turn is over, process it!
      this.layout.on('server/turn-finished', doTurn);

      // When the game begins, hide the overlay and if it's the player turn
      // display jutsus, if not, hide.
      this.layout.on('server/begin', setupGame);
    },

    // Views
    // ---------------------------------------------------------------------
    // When the game is ready, a websocket event will be triggered to render the
    // views, this function will be used to initialize them.
    initViews: function () {
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

      // Local player HP view
      this.layout.add(HPView, {
        el: '#player-1-hp',
        model: this.user
      });

      // Remote player HP view
      this.layout.add(HPView, {
        el: '#enemy-hp',
        model: this.enemy
      });

      this.layout.render();
    }

  };

  return app;

});
