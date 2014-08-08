'use strict';

var express = require('express');
var router  = new express.Router();

router.get('/duel/:roomId', function (req, res) {
  // If it's not logged in, redirect to login page
  if(!req.session.user) {
    res.redirect('/login');
    return;
  }

  // Get duel info
  var db = req.db;
  db.table('duels').findOne((+req.params.roomId)).then(function (row) {
    // Invalid duel
    if(!row) {
      res.redirect('/');
      return;
    }

    // Invalid user trying to access this duel
    if([row.player1, row.player2].indexOf(req.session.user.id) === -1) {
      res.redirect('/');
      return;
    }

    res.render('game/duel', { duel: row });
  }, function (err) {
    console.log('There has been an error in the database:', err);
    res.redirect('/oops', err);
  });
});

module.exports = router;
