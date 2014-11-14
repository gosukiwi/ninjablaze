/**
 * An NPC collection
 */
define(['jquery', 'backbone', 'models/npc'], function ($, Backbone, Npc) {
  'use strict';

  return Backbone.Collection.extend({

    model: Npc

  });
});
