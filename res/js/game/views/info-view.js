/* global define */
/**
 * The information view displays the jutsu info in the center of the user ui
 */
define(['backbone', 'underscore', 'text!templates/info.ejs', 'state'], 
    function(Backbone, _, infoTemplate, state) {

  'use strict';

  return Backbone.View.extend({

    initialize: function (options) {
      this.manager = options.manager;
      //this.listenTo(state, 'change:currentJutsu', this.render);
      this.jutsu = null;

      // TODO: Proxy self in manager.on
      var self = this;
      this.manager.on('select-jutsu', function (jutsu) {
        self.updateJutsu(jutsu);
      });
    },

    updateJutsu: function (jutsu) {
      this.jutsu = jutsu;
      this.render();
    },

    template: _.template(infoTemplate),

    render: function () {
      this.$el.html(this.template({
        jutsu: this.jutsu
      }));
    },

    events: {
      'click .attack': function () {
        state.get('player1').set('currentHp', 1000);
      },

      'click .cancel': function () {
        //state.set('currentJutsu', null);
        this.updateJutsu(null);
      }
    }

  });

});
