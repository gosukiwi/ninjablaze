define(['jquery', 'io', 'views/lobby-view'], function($, io, LobbyView) {
  'use strict';

  function Initialize() {
    new LobbyView();
  }

  return {
    Initialize: Initialize
  };
});
