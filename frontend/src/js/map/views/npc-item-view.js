/**
 * Draws all NPCS in this map
 */
define(['backbone'], function(Backbone) {
  'use strict';

  return Backbone.View.extend({

    initialize: function (options) {
      this.layout = options.layout;
    },

    tagName: 'li',

    render: function () {
      this.$el.html(this.model.get('name'));
      return this;
    },

    events: {
      'click': function () {
        this.layout.trigger('ui/show-npc', this.model);
      },
    },

  });

});
