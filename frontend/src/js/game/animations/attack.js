/**
 * An attack animation, it moves the fromElement up to the toElement and back.
 */
define(['tweenr'], function (tweenr) {
  'use strict';

  return function ($from, $to) {
    var fromCoords = $from.offset();
    var toCoords   = $to.offset();
    var diff       = [toCoords.left - fromCoords.left, toCoords.top - fromCoords.top];

    function render(val) {
      $from.css({ transform: 'translateY(' + val + 'px)' });
    }

    return tweenr().chain([
      { 
        props: [{ from: 0, to: 10 }],
        dur: 100,
        fn:  'square'
      },
      { 
        props: [{ from: 10, to: diff[1] }],
        dur: 700,
        fn:  'square'
      },
      { 
        props: [{ from: diff[1], to: 0 }],
        dur: 1000,
        fn:  'square'
      },
    ], render);
  };
});
