/**
 * Draws and updates the game log
 */
define(['backbone', 'underscore'], 
    function(Backbone) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      this.listenTo(this.layout, 'ui/loaded', this.onLoaded);
    },

    className: 'loader',

    onLoaded: function () {
      this.$el.hide();
    }

  });

});
