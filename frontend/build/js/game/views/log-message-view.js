define(['backbone', 'underscore', 'text!templates/log-message.ejs'], 
    function(Backbone, _, logMessageTemplate) {

  'use strict';

  return Backbone.View.extend({

    template: _.template(logMessageTemplate),

    render: function () {
      this.setElement(this.template({ message: this.model.attributes }));
      return this;
    }

  });

});
