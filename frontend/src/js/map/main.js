/**
 * Map
 */
'use strict';

require.config({
  paths: {
    'text': '../../vendor/requirejs-text/text',
    'jquery': '../../vendor/jquery/dist/jquery',
    'backbone': '../../vendor/backbone/backbone',
    'underscore': '../../vendor/lodash/dist/lodash.underscore',
  }
});

require(['app'], function(app) {
  app.initialize();
});
