/**
 * The menu of all jutsus
 */
define(['backbone', 'underscore', 'views/jutsu-menu-item-view'], 
    function(Backbone, _, JutsuMenuItemView) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      this.listenTo(this.layout, 'enter-turn', this.enterTurn);
      this.listenTo(this.layout, 'leave-turn', this.leaveTurn);
      console.log('bind stuff in menu view');
    },

    enterTurn: function () {
      console.log('show menu');
      this.$el.show();
    },

    leaveTurn: function () {
      console.log('hide menu');
      this.$el.hide();
    },

    render: function () {
      var self = this;
      self.$el.empty();
      this.collection.each(function (jutsu) {
        var view = new JutsuMenuItemView({ model: jutsu, layout: self.layout });
        self.$el.append(view.render().el);
      });
    }

  });

});
