'use strict';

var mechanics = require('../helpers/game-mechanics');
// Duels going on right now
var duels     = {};

// Remove a duel from the database
function closeGame(db, room/*, winner*/) {
  delete duels[room.id];
  db.table('duels').remove({ id: room.id }).then(function () {
    console.log('Cleaned up room');
  }, function (err) {
    console.log('Could not delete room:', err);
  });

  // TODO: Add to match history
}

function handleSocket(socket, db) {
  // A player is ready to start, build the room for the duel. 
  // IMPORTANT! This also gets called on reconnect, so handle properly.
  // "duel" contains data read from the frontend, duel id and players
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

      // Set up initial state
      if(!room.state) {
        console.log('Create room state, should be done only once');
        // The room is waiting for players to prepare their jutsus
        room.state = {
          p1: {
            status: 'waiting',
            jutsu: 'none',
            damage: 0//,
            // TODO: Store HP here
            //currentHP: res.hp
          },
          p2: {
            status: 'waiting',
            jutsu: 'none',
            damage: 0//,
            // TODO: Store HP here
            //currentHP: res.hp
          }
        };
      } else {
        console.log('Room state was already existing:', room.state);
      }

      var reconnect = null;
      var userinfo = res;
      delete userinfo.token;
      delete userinfo.pass;
      // Set the room ID
      console.log('created room', room.id);
      room.id = duel.id;
      if(res.id === room.player1) {
        // Is this the first time we connect?
        if(!room.p1Ready) {
          console.log('p1 is ready');
          room.p1Ready     = true;
          room.p1HP        = res.hp;
          room.p1CurrentHP = res.hp;
          room.p1Userinfo  = userinfo;
        } else {
          reconnect = 'p1';
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
        } else {
          reconnect = 'p2';
        }

        // It's a reconnect, just refresh socket
        room.p2Socket   = socket;
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

        if(!reconnect) {
          room.p1Socket.emit('game/begin', 'p1', playersinfo, room.state);
          room.p2Socket.emit('game/begin', 'p2', playersinfo, room.state);
          console.log('game begin, state is', room.state);
        } else {
          console.log(reconnect, 'reconnected');
          room[reconnect + 'Socket'].emit('game/begin', reconnect, playersinfo, room.state);
        }
      } else {
        // Only one player is ready, wait for the second
        console.log('first player registered, player is ready');
        //socket.emit('game/player-is-ready', res.user);
      }
    }, function (err) {
      // Invalid user, could not find that token
      console.log('cannot find player with token: ', playerToken, err);
    });
  });

  // A player wants to attack, thus prepare her jutsu
  socket.on('game/attack', function (jutsu, roomId, player) {
    var room = duels[roomId];
    if(!room) {
      // TODO: Send no room error and respond in frontend
      console.log('room not found');
      return;
    }

    console.log('Try to attack with', jutsu);
    if(!jutsu) {
      console.log('select a jutsu! cannot attack');
      return;
    }

    var num    = (+room.p1Userinfo.id) === (+player.id) ? 'p1' : 'p2';
    var enemy  = (+room.p1Userinfo.id) === (+player.id) ? room.p2Userinfo : room.p1Userinfo;
    // Get the enemy userinfo and calculate the effective jutsu damage
    var damage = mechanics.attack(player, enemy, jutsu);
    if(room.state[num].status === 'waiting') {
      console.log('Registered!', num, 'is ready');
      room.state[num].status = 'ready';
      room.state[num].jutsu = jutsu;
      room.state[num].damage = damage;
    } else {
      // Already attacked?
      // TODO: Send no turn error and respond in frontend.
      console.log('You have already attacked!');
      return;
    }

    if(room.state.p1.status === 'ready' && room.state.p2.status === 'ready') {
      console.log('Both players are ready according to state', room.state);

      // Process turn
      room.p1CurrentHP = room.p1CurrentHP - room.state.p2.damage;
      room.p2CurrentHP = room.p2CurrentHP - room.state.p1.damage;

      // Who is faster? The faster attacks first.
      // TODO: If they are equal, make it random
      var first  = room.p1Userinfo.agi > room.p2Userinfo.agi ? 'p1' : 'p2';
      var second = first === 'p1' ? 'p2' : 'p1';

      // Did any of the players die? Check for the one who got attacked first
      if(room[second + 'CurrentHP'] <= 0) {
        // Game over! The winner is "first", the first who attacked.
        room.p1Socket.emit('game/game-over', first);
        room.p2Socket.emit('game/game-over', first);
        closeGame(db, room, first);
      } else if(room[first + 'CurrentHP'] <= 0) {
        // Game over! The winner is "first", the first who attacked.
        room.p1Socket.emit('game/game-over', second);
        room.p2Socket.emit('game/game-over', second);
        closeGame(db, room, second);
      } else {
        var state = {
          p1: {
            currentHP: room.p1CurrentHP,
            jutsuUsed: room.state.p1.jutsu,
            damageDealt: room.state.p1.damage
          },
          p2: {
            currentHP: room.p2CurrentHP,
            jutsuUsed: room.state.p2.jutsu,
            damageDealt: room.state.p2.damage
          },
          first: first
        };
        room.p1Socket.emit('game/turn-finished', state);
        room.p2Socket.emit('game/turn-finished', state);

        // Clean up state
        room.state.p1.status = 'waiting';
        room.state.p1.jutsu  = 'none';
        room.state.p1.damage = 0;
        room.state.p2.status = 'waiting';
        room.state.p2.jutsu  = 'none';
        room.state.p2.damage = 0;
      }
    }

  });
}

module.exports = handleSocket;
