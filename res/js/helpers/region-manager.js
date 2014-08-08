define(['backbone', 'underscore'], function(Backbone, _) {
  'use strict';

  var RegionManager = function() {
    this.regions = [];
  };

  RegionManager.prototype = _.extend(RegionManager.prototype, 
  // Public methods
  {
    
    // Add a view to the manager
    add: function (View, options) {
      options = _.extend({ manager: this }, options);
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

  return RegionManager;
});
