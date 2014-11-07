'use strict';

var logged_users = {};

function handleSocket(socket, db) {
  socket.on('lobby/msg', function (msg) {
    if(msg && msg.msg) {
      socket.broadcast.emit('lobby/new-msg', msg);
    }
  });

  // Authentication process. When an user logs in she gets a cookie named
  // 'token' with a random and unique token, the same token is also in the
  // database with the her IP. To authenticate in the system simply use that
  // token and her IP, if IPs don't match the user will have to log-in
  // again.
  socket.on('lobby/auth', function (user) {
    var ip = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    var token = user.token;

    db.table('users').findOne({ token: ip + ':' + token }).then(function (user) {
      if(!user) {
        socket.emit('lobby/invalid-auth');
        return;
      }

      var userdata = {
        user: user.user,
        email: user.email,
        id: user.id
      };
      logged_users[user.user] = { socket: socket, user: userdata };

      // Create array of online users
      var online = [];
      Object.keys(logged_users).forEach(function (key) {
        online.push(logged_users[key].user);
      });

      // Send a welcome message to the user, and a broadcast to everyone else
      socket.emit('lobby/welcome', { user: userdata, online: online });
      socket.broadcast.emit('lobby/new-user', userdata);
    });
  });

  // Player 1 sends a duel request
  socket.on('lobby/duel-request', function (players) {
    // Get player2's socket and ask for a duel
    var player_socket = logged_users[players.p2].socket;
    player_socket.emit('lobby/ask-for-duel', players);
  });

  // Player 2 accepted the duel request.
  socket.on('lobby/duel-yes', function (players) {
    var p1        = logged_users[players.p1];
    var p2        = logged_users[players.p2];
    var p1_socket = p1.socket;
    var p1_id     = p1.user.id;
    var p2_id     = p2.user.id;

    db.table('duels').insert({
      'player1': p1_id,
      'player2': p2_id,
      'winner': 0
    }).then(function (res) {
      socket.emit('lobby/duel-start', players, res.insertId);
      p1_socket.emit('lobby/duel-start', players, res.insertId);
    }, function (err) {
      // Emit a DB error to both players
      // TODO: Handle this in client side?
      socket.emit('lobby/duel-db-error', err);
      p1_socket.emit('lobby/duel-db-error', err);
    });
  });

  // Player 2 declined the duel request
  socket.on('lobby/duel-no', function (players) {
    var player_socket = logged_users[players.p1].socket;
    player_socket.emit('lobby/duel-declined', players);
  });

  socket.on('disconnect', function () {
    // For each of my users check who disconnected
    Object.keys(logged_users).every(function (key) {
      var s = logged_users[key].socket;
      var user = logged_users[key].user;
      if(socket === s) {
        // Found! Just remove from the list and throw a DC event
        delete logged_users[user];
        socket.broadcast.emit('lobby/user-dc', user);
        return false;
      }

      return true;
    });
  });
}

module.exports = handleSocket;
