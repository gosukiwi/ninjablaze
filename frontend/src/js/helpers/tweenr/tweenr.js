/**
 * Tween a property
 */
define([
    'jquery', 
    'helpers/tweenr/apply-fn',
    // requestAnimationFrame polyfill
    'helpers/tweenr/raf'
  ], function (
    $, 
    ApplyFn
  ) {

  'use strict';

  return function () {
    var duration;
    var stepCb;
    var start;
    var elapsed;
    var ammountToAnimate;
    var ammountFrom;
    var animationFn;
    var defer;

    function applyFn(proportion, fn) {
      if(ApplyFn[fn]) {
        return ApplyFn[fn](proportion);
      } 

      return proportion;
    }

    function animate(currentTime) {
      if(elapsed > duration) {
        defer.resolve(elapsed);
        return;
      }

      if(!start) {
        start = currentTime;
        elapsed = 0;
      } else {
        elapsed = currentTime - start;
      }

      window.requestAnimationFrame(animate);
      // elapsed %
      var proportion = elapsed / duration;
      if(proportion > 1) {
        proportion = 1;
      }
      proportion = applyFn(proportion, animationFn);
      stepCb(ammountFrom + ammountToAnimate * proportion);
    }

    return {
      init: function (dur, from, to, fn) {
        ammountFrom         = from;
        duration            = dur;
        ammountToAnimate    = to - from;
        animationFn         = fn;
        start               = undefined;
        elapsed             = 0;
      },

      start: function (cb) {
        stepCb   = cb;
        defer    = $.Deferred();
        window.requestAnimationFrame(animate);
        return defer.promise();
      },

      animate: function (dur, from, to, fn, cb) {
        this.init(dur, from, to, fn);
        return this.start(cb);
      },

      /**
       * Animates though a path, defined in an array of objects:
       * [
       *   { dur: 1000, from: 0, to: 100, fn: 'linear' },
       *   { dur: 1000, from: 100, to: 50, fn: 'square' }
       * ]
       */
      path: function (arr, cb) {
        var self = this;
        var len  = arr.length;
        var pathDeferred = $.Deferred();

        function startPath(arr, cb) {
          if(!arr || arr.length === 0) {
            return;
          }

          var item = arr.shift();
          self.animate(item.dur, item.from, item.to, item.fn, cb).then(function () {
            startPath(arr, cb);
          }).then(function () {
            len = len - 1;
            if(len === 0) {
              pathDeferred.resolve();
            }
          });
        }

        startPath(arr, cb);
        return pathDeferred.promise();
      }
    };
  };
});
