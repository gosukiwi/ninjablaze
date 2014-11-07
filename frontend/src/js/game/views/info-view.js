/* global define */
/**
 * The information view displays the jutsu info in the center of the user ui
 */
define(['backbone', 'underscore', 'text!templates/info.ejs'], 
    function(Backbone, _, infoTemplate) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      this.layout.on('ui/select-jutsu', this.selectJutsu);
      this.listenTo(this.model, 'change', this.jutsuChanged);
    },

    selectJutsu: function (jutsu) {
      this.model.set(jutsu.toJSON());
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
