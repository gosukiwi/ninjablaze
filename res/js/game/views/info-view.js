/* global define */
/**
 * The information view displays the jutsu info in the center of the user ui
 */
define(['backbone', 'underscore', 'text!templates/info.ejs', 'state'], 
    function(Backbone, _, infoTemplate, state) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      this.listenTo(state, 'change:currentJutsu', this.render);
    },

    template: _.template(infoTemplate),

    render: function () {
      var currJutsu = state.get('currentJutsu');

      this.$el.html(this.template({
        jutsu: currJutsu
      }));

      return this;
    },

    events: {
      'click .attack': function () {
        state.get('player1').set('currentHp', 1000);
      },

      'click .cancel': function () {
        state.set('currentJutsu', null);
      }
    }

  });

});
