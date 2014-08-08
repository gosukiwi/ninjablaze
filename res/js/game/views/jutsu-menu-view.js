/* global define */
define(['backbone', 'underscore', 'views/jutsu-menu-item-view'], 
    function(Backbone, _, JutsuMenuItemView) {

  'use strict';

  return Backbone.View.extend({

    initialize: function (options) {
      this.manager = options.manager;
    },

    render: function () {
      var self = this;

      self.$el.empty();
      _.each(this.model, function (jutsu) {
        var view = new JutsuMenuItemView({ model: jutsu, manager: self.manager });
        self.$el.append(view.render().el);
      });
    }

  });

});
