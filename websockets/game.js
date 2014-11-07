'use strict';

var mechanics = require('../helpers/game-mechanics');
// Duels going on right now
var duels     = {};

function handleSocket(socket, db) {
  // A player is ready to start, build the room for the duel. 
  // IMPORTANT! This also gets called on reconnect, so handle properly.
  socket.on('game/ready', function (playerToken, duel) {
    console.log('game ready was emitted! Lets see...');

    // Create duel if not exists
    if(!duels[duel.id]) {
      duels[duel.id] = duel;
      console.log('created duel', duel);
    }

    var ip = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    var token = ip + ':' + playerToken;
    db.table('users').findOne({ token: token }).then(function (res) {
      // Nothing found? Invalid token!
      if(!res) {
        console.log('invalid token, exiting');
        socket.emit('game/invalid-token');
        return;
      }

      // Token is okay, so we now have the user data stored in `res`
      // Add players info to the current room. Make sure to delete sensitive
      // data.
      // "room" holds the state of current state of the game.
      var room = duels[duel.id];
      var userinfo = res;
      delete userinfo.token;
      delete userinfo.pass;
      if(res.id === room.player1) {
        // Is this the first time we connect?
        if(!room.p1Ready) {
          console.log('p1 is ready');
          room.p1Ready     = true;
          room.p1HP        = res.hp;
          room.p1CurrentHP = res.hp;
          room.p1Userinfo  = userinfo;
        }

        // It's a reconnect, just refresh socket
        room.p1Socket   = socket;
      } else {
        // Is this the first time we connect?
        if(!room.p2Ready) {
          console.log('p2 is ready');
          room.p2Ready     = true;
          room.p2HP        = res.hp;
          room.p2CurrentHP = res.hp;
          room.p2Userinfo  = userinfo;
        }

        // It's a reconnect, just refresh socket
        room.p2Socket   = socket;
      }

      if(!room.turn) {
        // p1 starts
        room.turn = 'p1';
        console.log('turn created from scratch, turn is p1');
      }

      // If both players are ready, start game!
      if(room.p1Ready && room.p2Ready) {
        console.log('begin game');
        var playersinfo = {
          p1: {
            hp: room.p1HP,
            currentHP: room.p1CurrentHP,
            userinfo: room.p1Userinfo
          },
          p2: {
            hp: room.p2HP,
            currentHP: room.p2CurrentHP,
            userinfo: room.p2Userinfo
          }
        };
        room.p1Socket.emit('game/begin', 'p1', playersinfo, room.turn);
        room.p2Socket.emit('game/begin', 'p2', playersinfo, room.turn);
        console.log('game begin, turn is', room.turn, 'room info:', room);
      } else {
        // Only one player is ready, wait for the second
        console.log('first player registered, player is ready');
        socket.emit('game/player-is-ready', res.user);
      }
    }, function (err) {
      console.log('cannot find player with token: ', playerToken, err);
    });
  });

  // A player wants to attack
  socket.on('game/attack', function (jutsu, roomId, player) {
    var room = duels[roomId];
    if(!room) {
      // TODO: Send no room error and respond in frontend
      console.log('room not found');
      return;
    }

    // Check if it's in the correct turn, cast both values to integers
    if((+room[room.turn + 'Userinfo'].id) !== (+player.id)) {
      // TODO: Send no turn error and respond in frontend.
      console.log('You cannot attack because you are not ', room.turn);
      return;
    }

    // Get the enemy userinfo and calculate the effective jutsu damage
    var enemy  = (+room.p1Userinfo.id) === (+player.id) ? room.p2Userinfo : room.p1Userinfo;
    var damage = mechanics.attack(player, enemy, jutsu);
    // Emit attacked event and change turn
    if(room.turn === 'p1') {
      console.log('p1 attacked p2', damage, enemy, jutsu);
      room.turn = 'p2';
      room.p2CurrentHP = room.p2CurrentHP - damage;
      room.p2Socket.emit('game/attacked', damage, room.p2CurrentHP, jutsu);
    } else {
      console.log('p2 attacked p1', damage, enemy, jutsu);
      room.turn = 'p1';
      room.p1CurrentHP = room.p1CurrentHP - damage;
      room.p1Socket.emit('game/attacked', damage, room.p1CurrentHP, jutsu);
    }
    console.log(enemy, 'takes', damage, 'damage');

    if(room.p1CurrentHP <= 0) {
      // Emit turn change
      room.p1Socket.emit('game/game-over', 'p2 wins');
      room.p2Socket.emit('game/game-over', 'p2 wins');

      // TODO: Destroy room
    } else if(room.p2CurrentHP <= 0) {
      room.p1Socket.emit('game/game-over', 'p1 wins');
      room.p2Socket.emit('game/game-over', 'p1 wins');

      // TODO: Destroy room
    } else {
      // Emit turn change
      room.p1Socket.emit('game/turn', room.turn);
      room.p2Socket.emit('game/turn', room.turn);
    }
  });
}

module.exports = handleSocket;
