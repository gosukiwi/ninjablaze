/**
 * Game entry point.
 */
'use strict';

require.config({
  /*paths: {
    'text': '../../vendor/requirejs-text/text',
    'jquery': '../../vendor/jquery/dist/jquery',
    'backbone': '../../vendor/backbone/backbone',
    'underscore': '../../vendor/underscore/underscore',
    'pubsub': '../../vendor/pubsub/pubsub'
  }*/

  paths: {
    'text': '../../vendor/requirejs-text/text',
    'jquery': '../../vendor/jquery/dist/jquery',
    'backbone': '../../vendor/backbone/backbone',
    'underscore': '../../vendor/underscore/underscore',
    'io': '/socket.io/socket.io.js',
    'jquery-cookie': '../../vendor/jquery-cookie/jquery.cookie',
    'backbone-modalview': '../../vendor/backbone-modalview/backbone.modalview'
  }
});

require(['app'], function(app) {
  app.Initialize();
});
