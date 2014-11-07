define(['backbone', 'underscore', 'text!templates/jutsu.ejs'], 
    function(Backbone, _, jutsuMenuTemplate) {

  'use strict';

  return Backbone.View.extend({

    initialize: function (options) {
      this.layout = options.layout;
    },

    tagName: 'li',

    template: _.template(jutsuMenuTemplate),

    render: function () {
      this.$el.html(this.template({
        jutsu: this.model.toJSON()
      }));

      return this;
    },

    events: {
      // clicking on a jutsu
      'click a': function () {
        this.layout.trigger('select-jutsu', this.model);
      }
    }

  });

});
