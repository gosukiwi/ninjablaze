/**
 * Draws and updates a player's HP bar
 */
define(['backbone', 'underscore', 'text!templates/hp.ejs'], 
    function(Backbone, _, hpTemplate) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      this.listenTo(this.layout, 'ui/got-attacked', this.attacked);
      this.listenTo(this.model, 'change:currentHP', this.update);
    },

    attacked: function (damage, currentHP) {
      // Let's make sure we don't break anything!
      if(currentHP < 0) {
        currentHP = 0;
      }
      this.model.set('currentHP', currentHP);
    },

    template: _.template(hpTemplate),

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    update: function () {
      var curr = this.model.get('currentHP');
      var total = this.model.get('hp');
      var perc = parseInt(curr * 100 / total, 10);

      this.$el.find('.meter').animate({ 'width': perc + '%' });
      this.$el.find('#current').text(curr);
    }

  });

});
