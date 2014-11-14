define([
    'map',
    'websockets',
    'helpers/layout',
    'collections/npcs',
    'models/npc',
    'views/npcs-view',
    'views/dialog-view',
  ], 
  function (
    map,
    webSockets,
    Layout,
    Npcs,
    Npc,
    NpcsView,
    DialogView
) {
  'use strict';

  return {

    initialize: function () {
      this.layout = new Layout();
      this.initViews();

      map.initialize();
      webSockets.initialize(this.layout);

      // initialize
      this.layout.trigger('ui/get-npcs', map.position());
    },

    initViews: function () {
      console.log('init views');
      
      var npcs = new Npcs();

      this.layout.add(NpcsView, { 
        el: '#npc-list',
        collection: npcs,
      });

      this.layout.add(DialogView, {
        el: '.dialog',
        model: new Npc({ name: 'none' }),
      });

      this.layout.render();
    },

  };
});
