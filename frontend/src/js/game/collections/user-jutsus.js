/* global define */
/**
 * A jutsu from a player
 */
define(['jquery', 'backbone', 'models/jutsu'], function ($, Backbone, Jutsu) {
  'use strict';

  return Backbone.Collection.extend({

    model: Jutsu,

    url: '/user/jutsus'

  });
});
