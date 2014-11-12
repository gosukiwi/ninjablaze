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
      description: 'no description',
      // type can either be trap or poison
      effect_type: 'none',
      effect_duration: 0,
      effect_damage: 0,
    }
  });
});
