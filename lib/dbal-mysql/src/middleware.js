/**
 * Make the DBAL work as an Express middleware for easy interaction
 */

var Dbal = require('./db');

module.exports = function (conf) {
  'use strict';

  return function(req, res, next) {
    req.db = new Dbal(conf);
    next();
  };
};
