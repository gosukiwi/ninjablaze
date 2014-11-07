/**
 * A jutsu from a player
 */
define(['jquery', 'backbone'], function ($, Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      id: 0,
      name: 'no name',
      damage: 10,
      element: 'none',
      type: 'ninjutsu',
      description: 'no description'
    }
  });
});
