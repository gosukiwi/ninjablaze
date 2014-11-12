/**
 * Draws and updates the game log
 */
define(['backbone', 'underscore', 'views/log-message-view'], 
    function(Backbone, _, LogMessageView) {

  'use strict';

  return Backbone.View.extend({

    initialize: function () {
      this.listenTo(this.collection, 'add', this.add);
      this.listenTo(this.layout, 'ui/log-message', this.onNewMessage);
    },

    onNewMessage: function (message) {
      this.collection.add(message);
    },

    add: function (message) {
      var view = new LogMessageView({ model: message });
      this.$el.find('ul').append(view.render().el);
      this.$el.scrollTop(this.$el.outerHeight());
    },

    render: function () {
      var list = $('<ul></ul>');
      this.collection.each(function (message) {
        var view = new LogMessageView({ model: message });
        list.append(view.render().el);
      });

      this.$el.html(list);
    }

  });

});
