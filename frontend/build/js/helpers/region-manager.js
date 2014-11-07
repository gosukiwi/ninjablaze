define(['backbone', 'underscore'], function(Backbone, _) {
  'use strict';

  var Layout = function() {
    this.regions = [];
  };

  Layout.prototype = _.extend(Layout.prototype, 
  // Public methods
  {
    
    // Add a view to the manager
    add: function (View, options) {
      var self = this;
      //options = _.extend({ manager: this }, options);
      var constructor = View.prototype.initialize;
      if(_.isFunction(constructor)) {
        View.prototype.initialize = function () {
          this.manager = self;
          constructor.apply(this, arguments);
        };
      }

      var view = new View(options);
      this.regions.push(view);
    },

    render: function () {
      _.each(this.regions, function (view) {
        if(_.isFunction(view.render)) {
          view.render();
        }
      });
    }

  }, 
  // Also extend from Backbone.Events so we make this object a Mediator/PubSub
  // Views can then do
  //
  //   this.manager.trigger('something-happened');
  //
  // And
  //
  //   this.manager.on('something-else', this.doSomething);
  Backbone.Events);

  return Layout;
});
