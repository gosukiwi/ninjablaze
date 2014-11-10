/**
 * Game entry point.
 */
'use strict';

require.config({
  paths: {
    'text': '../../vendor/requirejs-text/text',
    'jquery': '../../vendor/jquery/dist/jquery',
    'backbone': '../../vendor/backbone/backbone',
    'underscore': '../../vendor/lodash/dist/lodash.underscore',
    'io': '/socket.io/socket.io.js',
    'jquery-cookie': '../../vendor/jquery-cookie/jquery.cookie',
    'backbone-modalview': '../../vendor/backbone-modalview/backbone.modalview',
    'helpers': '../helpers/',
    'tweenr': '../../vendor/tweenr/dist/tweenr-full',
  }
});

require(['app'], function(app) {
  app.initialize();
});
