/* global define */
/**
 * Main game application, two players battle it out!
 */
define(['jquery', 'views/user-ui-view'], 
    function ($, UserUIView) {

  'use strict';

  return {

    Initialize: function () {
      new UserUIView({
        el: '#player-ui'
      });
    }

  };

});
