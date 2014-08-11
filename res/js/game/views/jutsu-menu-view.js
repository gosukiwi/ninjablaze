/**
 * The menu of all jutsus
 */
define(['backbone', 'underscore', 'views/jutsu-menu-item-view'], 
    function(Backbone, _, JutsuMenuItemView) {

  'use strict';

  return Backbone.View.extend({

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
