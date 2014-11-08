/**
 * A bunch of log messages
 */
define(['jquery', 'backbone', 'models/log-message'], function ($, Backbone, LogMessage) {
  'use strict';

  return Backbone.Collection.extend({

    model: LogMessage

  });
});
