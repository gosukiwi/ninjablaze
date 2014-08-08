/* global define */
define(['backbone', 'underscore', 'text!templates/jutsu.ejs', 'views/info-view', 
    'state'], function(Backbone, _, jutsuMenuTemplate/*, InfoView*/) {

  'use strict';

  return Backbone.View.extend({

    initialize: function (options) {
      this.manager = options.manager;
    },

    tagName: 'li',

    template: _.template(jutsuMenuTemplate),

    render: function () {
      this.$el.html(this.template({
        jutsu: this.model
      }));

      return this;
    },

    events: {
      // clicking on a jutsu
      'click a': function () {
        this.manager.trigger('select-jutsu', this.model);
      }
    }

  });

});
