'use strict';

var express = require('express');
var router  = new express.Router();

router.get('/map', function (req, res) {
  // If it's not logged in, redirect to login page
  //if(!req.session.user) {
  //  res.redirect('/login');
  //  return;
  //}
  
  res.render('map/world-map');
});

module.exports = router;
