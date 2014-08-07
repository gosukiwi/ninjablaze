/* global define */
/**
 * Current game state
 */
define(['jquery', 'backbone'], function ($, Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      currentJutsu: null,
      player1: null,
      player2: null
    }
  });
});
