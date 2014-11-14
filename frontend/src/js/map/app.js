/**
 * Main map app
 */
define(['jquery', 'underscore'], function ($, _) {
  'use strict';

  var $map;
  var $cursor;
  var $player;
  var playerPosition = [4, 4];
  var cursorWidth;
  var cursorHeight;

  $(window).resize(_.debounce(function () {
    init();
  }, 300));

  function moveCursor(e) {
    var left   = (Math.ceil(e.clientX / cursorWidth) - 1);
    var top    = (Math.ceil(e.clientY / cursorHeight) - 1);
    $cursor.css({ left: left * cursorWidth + 'px', top: top * cursorHeight + 'px' });

    if(Math.abs(left - playerPosition[0]) > 1 || Math.abs(top - playerPosition[1]) > 1) {
      $cursor.addClass('is-invalid');
    } else {
      $cursor.removeClass('is-invalid');
    }
  }

  function moveTo(e) {
    var left   = (Math.ceil(e.clientX / cursorWidth) - 1);
    var top    = (Math.ceil(e.clientY / cursorHeight) - 1);

    // Is it a valid position?
    if(Math.abs(left - playerPosition[0]) > 1 || Math.abs(top - playerPosition[1]) > 1) {
      return;
    }

    playerPosition = [left, top];
    drawPlayer();
  }

  function drawPlayer() {
    var x = playerPosition[0];
    var y = playerPosition[1];
    $player.css({ 
      left: x * cursorWidth + (cursorWidth / 2) - ($player.width() / 2) + 'px',
      top:  y * cursorHeight + (cursorHeight / 2) - ($player.height() / 2) + 'px',
    });
  }

  function init() {
    $map         = $('.map');
    $cursor      = $('.cursor');
    $player      = $('.player');
    cursorWidth  = $cursor.width();
    cursorHeight = $cursor.height();

    $map
      .on('mousemove', _.throttle(moveCursor, 100))
      .on('click', moveTo);
    drawPlayer(playerPosition[0], playerPosition[1]);
  }

  return {
    initialize: init,
  };
});
