define(['helpers/tweenr/math-fn'], function (MathFuns) {
  'use strict';

  return {
    sqrt: function (proportion) {
      var from   = 0;
      var to     = 1;
      var curr   = (to - from) * proportion;
      var fnProp = MathFuns.sqrt(curr);
      return fnProp / MathFuns.sqrt(to - from);
    },

    square: function (proportion) {
      var from   = 0;
      var to     = 1;
      var curr   = (to - from) * proportion;
      var fnProp = MathFuns.square(curr);
      return fnProp / MathFuns.square(to - from);
    },

    cube: function (proportion) {
      var from   = 0;
      var to     = 1;
      var curr   = (to - from) * proportion;
      var fnProp = MathFuns.sqrt(curr);
      return fnProp / MathFuns.sqrt(to - from);
    },

    sin: function (proportion) {
      var from   = 0;
      var to     = Math.PI / 2;
      var curr   = (to - from) * proportion;
      var fnProp = MathFuns.sin(curr);
      return fnProp / MathFuns.sin(to - from);
    }
  };
});
