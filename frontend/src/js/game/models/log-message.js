/**
 * A log message
 */
define(['jquery', 'backbone'], function ($, Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      type:    'normal',
      message: ''
    }
  });
});
