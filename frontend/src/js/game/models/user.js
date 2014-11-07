/**
 * The current player of the game... "Player 1"
 */
define(['jquery', 'backbone', 'collections/jutsus'], function ($, Backbone, Jutsus) {
  'use strict';

  return Backbone.Model.extend({

    initialize: function () {
      var self = this;
      this.on('change', function () {
        // If jutsus are defined, "cast" them to a Jutsus collection
        var jutsus = self.get('jutsus');
        if(jutsus) {
          self.jutsus = new Jutsus(jutsus);
          self.unset('jutsus');
        }
      });
    },

    urlRoot: '/users',

    defaults: {
      'id'        : 0,
      'user'      : 'gosukiwi',
      'str'       : 10,
      'agi'       : 10,
      'int'       : 10,
      'chakra'    : 'water',
      'hp'        : 2500,
      'currentHP' : 2500,
      'level'     : 1,
      'jutsus'    : []
    }

  });
});
