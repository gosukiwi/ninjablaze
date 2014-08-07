/* global define */
/**
 * The current player of the game... "Player 1"
 */
define(['jquery', 'backbone'], function ($, Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      'name': 'gosukiwi',
      'str': 10,
      'agi': 10,
      'int': 10,
      'chakraNature': 'water',
      'hp': 2500,
      'currentHp': 1600,
      'level': 10,

      // The enabled jutsus for this user, all users have lots of jutsus but
      // they can only choose four when dueling.
      'jutsus': [
        {
          name: 'Gokakyou no jutsu',
          damage: 200,
          element: 'fire',
          type: 'ninjutsu',
          description: 'Some desc...'

        },
        {
          name: 'Replacemente jutsu',
          damage: 200,
          element: 0,
          type: 'ninjutsu',
          description: 'Some desc...'

        },
        {
          name: 'Throw Kunai',
          damage: 200,
          element: 0,
          type: 'taijutsu',
          description: 'Some desc...'

        },
        {
          name: 'Body Flicker',
          damage: 200,
          element: 0,
          type: 'ninjutsu',
          description: 'Some desc...'
        }
      ]
    }
  });
});