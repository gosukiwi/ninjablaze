'use strict';

// Duels going on right now
// They are in the format { id: roomId, player1: 4, player2: 6 }
var duels = {};

function handleSocket(socket, db) {
  // A player is ready to start
  socket.on('game/ready', function (playerToken, duel) {
    console.log('game ready was emitted! Lets see...');

    if(!duels[duel.id]) {
      console.log('create duel in memory...');
      duels[duel.id] = duel;
      console.log('created duel', duel);
    }

    var ip = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    var token = ip + ':' + playerToken;
    db.table('users').findOne({ token: token }).then(function (res) {
      if(!res) {
        console.log('invalid token, exiting');
        socket.emit('game/invalid-token');
        return;
      }

      var room = duels[duel.id];
      if(res.id === room.player1) {
        console.log('p1 is ready');
        room.p1Ready = true;
        room.p1Socket = socket;
        room.p1Userinfo = {
          user: res.user,
          id: res.id
        };
      } else {
        console.log('p2 is ready');
        room.p2Ready = true;
        room.p2Socket = socket;
        room.p2Userinfo = {
          user: res.user,
          id: res.id
        };
      }

      // Send a message to the player that he logged successfully
      socket.emit('game/logged', {
        user: res.user,
        id: res.id
      });

      // If both players are ready, start game!
      if(room.p1Ready && room.p2Ready) {
        console.log('begin game');
        var playerInfo = {
          p1: room.p1Userinfo,
          p2: room.p2Userinfo
        };
        room.p1Socket.emit('game/begin', playerInfo);
        room.p2Socket.emit('game/begin', playerInfo);
      } else {
      // Only one player is ready, wait for the second
        console.log('first player registered, player is ready');
        socket.emit('game/player-is-ready', res.user);
      }
    }, function (err) {
      console.log('cannot find player with token: ', playerToken, err);
    });
  });
}

module.exports = handleSocket;
