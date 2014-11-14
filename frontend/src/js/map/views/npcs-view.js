/**
 * Draws all NPCS in this map
 */
define(['backbone', 'models/npc', 'views/npc-item-view'], function(Backbone, Npc, NpcItemView) {
  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.layout, 'server/npc-list', this.loadNpcs);
    },

    loadNpcs: function (npcs) {
      var buffer = [];
      Object.keys(npcs).forEach(function (key) {
        buffer.push({ name: key, script: npcs[key] });
      });
      this.collection.reset(buffer);
    },

    render: function () {
      var self = this;

      this.$el.empty();
      this.collection.each(function (npc) {
        var view = new NpcItemView({ model: npc, layout: self.layout });
        self.$el.append(view.render().el);
      });

      return this;
    },

  });

});
