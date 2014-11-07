/**
 * Displays information about the currently selected justu.
 * Also has buttons which allow to use a jutsu or cancel.
 */
define(['backbone', 'underscore', 'text!templates/info.ejs'], 
    function(Backbone, _, infoTemplate) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      var self = this;
      this.layout.on('ui/select-jutsu', function (jutsu) {
        self.model.set(jutsu.toJSON());
      });

      this.listenTo(this.layout, 'ui/leave-turn', this.leaveTurn);

      this.listenTo(this.model, 'change', this.jutsuChanged);
    },

    leaveTurn: function () {
      this.model.clear();
    },

    jutsuChanged: function () {
      this.render();
    },

    template: _.template(infoTemplate),

    render: function () {
      var attrs = this.model.toJSON();
      var jutsu = _.isEmpty(attrs) ? null : attrs;
      this.$el.html(this.template({
        jutsu: jutsu
      }));
    },

    events: {
      'click .attack': function () {
        this.layout.trigger('ui/attack', this.model);
      },

      'click .cancel': function () {
        this.model.clear();
      }
    }

  });

});
