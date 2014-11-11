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
      //'animations/attack'
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
      LogMessages
      //attackAnimation
) {
  'use strict';

  function setupGame (player_num, players, state) {
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
      //app.enemy  = player_num === 'p1' ? 'p2' : 'p1';

      // Log a welcome message
      app.layout.trigger('ui/log-message', { type: 'normal', message: 'Connected!' });

      console.log('status is', state[app.player]);
      if(state[app.player].status === 'waiting') {
        console.log('trigger enter turn');
        app.layout.trigger('ui/enter-turn');
      } else {
        console.log('trigger leave turn');
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
        app.user.set('currentHP', playerstate.currentHP);

        // enemy
        var enemystate = state[app.player === 'p1' ? 'p2' : 'p1'];
        app.enemy.set('currentHP', enemystate.currentHP);

        // TODO: Remove this
        // Test animation for attack
        //attackAnimation($('#local-avatar'), $('#remote-avatar'))
        //.then(function () {
        //  // Add log messages
        //  var message = 'First player delt ' + state[state.first].damageDealt + ' damage';
        //  app.layout.trigger('ui/log-message', { type: 'normal', message: message });

        //  // Send next animation
        //  return attackAnimation($('#remote-avatar'), $('#local-avatar'));
        //})
        //.then(function () {
        //  // Add log messages
        //  var message = 'Second player attacked!';
        //  app.layout.trigger('ui/log-message', { type: 'normal', message: message });

        //  // Finally enter turn again
        //  app.layout.trigger('ui/enter-turn');
        //});
        
        app.layout.trigger('ui/enter-turn');
      }

  // Initialize the app in this anonymous object
  var app = {

    initialize: function () {
      // Layout definition
      this.layout = new Layout();

      // All events in the "server" namespace are received from the server,
      // others are generated locally in the UI.
      this.layout.on('ui/attack', attack);

      // Game over! GG.
      this.layout.on('server/game-over', gameOver);

      this.layout.on('server/turn-finished', doTurn);

      // When the game begins, hide the overlay and if it's the player turn
      // display jutsus, if not, hide.
      this.layout.on('server/begin', setupGame);

      // Web Sockets
      // ---------------------------------------------------------------------
      // Initialize web sockets, pass the layout as argument for the pubsub
      // implementation.
      WebSockets.initialize(this.layout);
    },

    // Views
    // ---------------------------------------------------------------------
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
