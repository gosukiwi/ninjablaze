define(['backbone', 'models/user'], function (Backbone, User) {
  'use strict';

  return Backbone.Collection.extend({
    model: User
  });
});
