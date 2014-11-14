/**
 * An NPC model
 */
define(['jquery', 'backbone'], function ($, Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      name: 'no name',
      script: {},
    }
  });
});
