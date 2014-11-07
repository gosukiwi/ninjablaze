/**
 * Displays information about the currently selected justu.
 * Also has buttons which allow to use a jutsu or cancel.
 */
define(['backbone', 'underscore', 'text!templates/info.ejs'], 
    function(Backbone, _, infoTemplate) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      this.listenTo(this.layout, 'ui/select-jutsu', this.selectJutsu);
      this.listenTo(this.layout, 'ui/wait-turn', this.clear);
      this.listenTo(this.model, 'change', this.jutsuChanged);
    },

    selectJutsu: function (jutsu) {
      this.model.set(jutsu.toJSON());
    },

    clear: function () {
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
        this.layout.trigger('ui/wait-turn');
      },

      'click .cancel': function () {
        this.model.clear();
      }
    }

  });

});
