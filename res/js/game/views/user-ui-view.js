/* global define */
/**
 * The whole user ui at the bottom of the game scene, it contains several sub
 * views.
 *
 * This view represents a GameState model, which has:
 *  * currentJutsu: The current jutsu the user selected, or null
 *  * player1: Local player info
 *  * player2: Remote player info
 */
define(['backbone', 'underscore', 'text!templates/jutsu.ejs', 
    'views/jutsu-menu-view', 'views/info-view', 'views/hp-view', 'state',
    'models/user'], 
    function(Backbone, _, jutsuMenuTemplate, JutsuMenuView, InfoView, HPView, state, User) {

  'use strict';

  return Backbone.View.extend({

    initialize: function (options) {
      // Save pubsub in instance
      this.pubsub = options.pubsub;

      this.jutsusView = new JutsuMenuView({
        el: '#jutsu-menu',
        model: state.get('player1').get('jutsus')
      });

      this.infoView = new InfoView({
        el: '#info-panel',
      });

      this.hpView = new HPView({
        el: '#player-1-hp',
        model: state.get('player1')
      });

      this.render();

      // When the sockets indicate, begin game
      this.pubsub.on('begin', this.beginGame);
    },

    render: function () {
      this.infoView.render();
      this.jutsusView.render();
      this.hpView.render();
    },

    beginGame: function (players) {
      var player1 = new User(players.p1);
      var player2 = new User(players.p2);
      var state = {
        player1: player1,
        player2: player2,
        turn: 1
      };
      console.log(state);
    }

  });

});
