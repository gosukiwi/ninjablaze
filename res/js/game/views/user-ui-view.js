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
    'views/jutsu-menu-view', 'views/info-view', 'views/hp-view', 'state'], 
    function(Backbone, _, jutsuMenuTemplate, JutsuMenuView, InfoView, HPView, state) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
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
    },

    render: function () {
      this.infoView.render();
      this.jutsusView.render();
      this.hpView.render();
    }

  });

});
