/* global define */
/**
 * Global game app state.
 */
define(['jquery', 'models/game-state', 'models/user'], 
    function ($, GameState, User) {

  'use strict';

  var player1 = new User();
  var player2 = new User();

  return new GameState({
    currentJutsu: null,
    player1: player1,
    player2: player2
  });

});
