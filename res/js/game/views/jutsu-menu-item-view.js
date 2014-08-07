/* global define */
define(['backbone', 'underscore', 'text!templates/jutsu.ejs', 'views/info-view', 
    'state'], function(Backbone, _, jutsuMenuTemplate, InfoView, state) {

  'use strict';

  return Backbone.View.extend({

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
        state.set('currentJutsu', this.model);
      }
    }

  });

});
