define(['backbone'], function (Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      user: 'anon_' + ('' + Math.random()).substr(2, 6)
    }
  });
});
