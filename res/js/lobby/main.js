'use strict';

require.config({
  paths: {
    'jquery': '../../vendor/jquery/dist/jquery',
    'backbone': '../../vendor/backbone/backbone',
    'underscore': '../../vendor/underscore/underscore',
    'io': '/socket.io/socket.io.js',
    'jquery-cookie': '../../vendor/jquery-cookie/jquery.cookie',
    'backbone-modalview': '../../vendor/backbone-modalview/js/backbone.modalview'
  }
});

require(['app'], function (app) {
  app.Initialize();
});
