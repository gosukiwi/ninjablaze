'use strict';

// Database configuration
// TODO: Make this in only one place in the whole app
var Dbal  = require('../lib/dbal-mysql/src/db');
var db    = new Dbal({
  host:       'localhost',
  user:       'root',
  password:   'root',
  database:   'ninjablaze'
});

// Web socket handlers
// ---------------------------------------------------------------------------
var lobby = require('./lobby');
var game  = require('./game');

// Start server and pass on all handlers
function startServer (http) {
  var io = require('socket.io')(http);
  io.on('connection', function (socket) {
    lobby(socket, db);
    game(socket, db);
  });
}

module.exports = startServer;
