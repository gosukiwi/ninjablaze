'use strict';

var express = require('express');
var router  = new express.Router();

// Routes for administrators only
// ---------------------------------------------------------------------------
router.get('/jutsus', function (req, res) {
  // If it's not logged in, redirect to login page
  //if(!req.session.user) {
  //  res.redirect('/login');
  //  return;
  //}

  req.db.table('jutsus').find().then(function (rows) {
    res.render('jutsu/index', { jutsus: rows });
  });
});

router.post('/jutsus/new', function (req, res) {
  var params = req.body;
  delete params._csrf;
  req.db.table('jutsus').insert(params).then(function () {
    res.redirect('/jutsus');
  }, function () {
    res.render('error');
  });
});

router.get('/jutsus/new', function (req, res) {
  //req.db.table('jutsus').find();
  res.render('jutsu/new', { token: req.csrfToken() });
});

router.post('/jutsus/:id/edit', function (req, res) {
  // If it's not logged in, redirect to login page
  //if(!req.session.user) {
  //  res.redirect('/login');
  //  return;
  //}

  delete req.body._csrf;
  req.db.table('jutsus').update(req.body, { id: req.params.id }).then(function () {
    res.redirect('/jutsus');
  }, function (err) {
    console.log('Database error when trying to edit a jutsu', err);
    res.render('error');
  });
});

router.get('/jutsus/:id/edit', function (req, res) {
  // If it's not logged in, redirect to login page
  //if(!req.session.user) {
  //  res.redirect('/login');
  //  return;
  //}

  req.db.table('jutsus').findOne(req.params.id).then(function (jutsu) {
    res.render('jutsu/edit', { jutsu: jutsu, token: req.csrfToken() });
  }, function (err) {
    console.log('Database error when trying to find a jutsu', err);
    res.render('error');
  });
});

router.get('/jutsus/:id/delete', function (req, res) {
  // If it's not logged in, redirect to login page
  //if(!req.session.user) {
  //  res.redirect('/login');
  //  return;
  //}

  req.db.table('jutsus').remove(req.params.id).then(function () {
    res.redirect('/jutsus');
  }, function (err) {
    console.log('Database error when trying to find a jutsu', err);
    res.render('error');
  });
});

module.exports = router;
