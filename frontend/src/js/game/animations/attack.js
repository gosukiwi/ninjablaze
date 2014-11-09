/**
 * An attack animation, it moves the fromElement up to the toElement and back.
 */
define(['helpers/tweenr/tweenr'], function (tweenr) {
  'use strict';

  return function ($from, $to) {
    var fromCoords = $from.offset();
    var toCoords   = $to.offset();
    var diff       = [toCoords.left - fromCoords.left, toCoords.top - fromCoords.top];

    function render(val) {
      $from.css({ transform: 'translateY(' + val + 'px)' });
    }

    tweenr().path([
      { 
        dur: 100,
        from: 0,
        to: 10,
        fn: 'square'
      },
      { 
        dur: 1000,
        from: 10,
        to: diff[1],
        fn: 'square'
      },
      { 
        dur: 1000,
        from: diff[1],
        to: 0,
        fn: 'square'
      }
    ], render)
    .then(function () {
      console.log('path ended!');
    });
  };
});
