/* global define */
define(['backbone', 'underscore', 'views/jutsu-menu-item-view'], 
    function(Backbone, _, JutsuView) {

  'use strict';

  return Backbone.View.extend({

    render: function () {
      var self = this;

      self.$el.empty();
      _.each(this.model, function (jutsu) {
        var view = new JutsuView({ model: jutsu });
        self.$el.append(view.render().el);
      });
    }

  });

});
