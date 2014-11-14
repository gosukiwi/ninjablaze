/**
 * Manages the dialog for an NPC.
 */
define(['backbone'], function(Backbone) {
  'use strict';

  var stage = 0;
  var slide = 0;

  return Backbone.View.extend({

    initialize: function () {
      var self = this;
      this.layout.on('ui/show-npc', function (npc) {
        self.model = npc;
        self.render();
        stage = 0; // TODO: get from server
        slide = 0;
      });
    },

    message: function () {
      return this.model.get('script').stages[stage].dialog[slide];
    },

    next: function () {
      if(slide < this.model.get('script').stages[stage].dialog.length - 1) {
        slide = slide + 1;
      }
    },

    render: function () {
      if(this.model.get('name') === 'none') {
        return this;
      }

      this.$el.find('#dialog').text(
        this.model.get('name') + ': ' + this.message()
      );

      return this;
    },

    events: {
      'click .btn': function () {
        this.next();
        this.render();
      },
    },

  });

});
