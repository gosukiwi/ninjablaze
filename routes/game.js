'use strict';

exports.duel = function (req, res) {
  // If it's not logged in, redirect to login page
  if(!req.session.user) {
    res.redirect('/login');
    return;
  }

  res.render('game/duel');
};
