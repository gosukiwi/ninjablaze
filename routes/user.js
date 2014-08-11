/**
 * User routes, these routes are related with user stuff :)
 */

'use strict';

var express = require('express');
var router = new express.Router();

// Helper functions
// ---------------------------------------------------------------------------

// Logs in an user using the request object
function login_user(user, req, res) {
  var db      = req.db;
  var uuid    = require('node-uuid');
  
  // Save the session
  req.session.user = user;
  // Set the token cookie
  var guid = uuid.v4();
  res.cookie('token', guid);

  // Save the token in the database
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  db.table('users').update({ token: ip + ':' + guid }, user.id);
}

function logout_user(req, res) {
  if(req.session.user) {
    delete req.session.user;
    res.clearCookie('token');
  }
}

// Route definitions
// ---------------------------------------------------------------------------

router.get('/register', function (req, res) {
  res.render('user/register');
});

router.post('/register', function (req, res) {
  var params  = req.body;
  var db      = req.db;

  if( params.username.length < 4 || 
      params.password.length < 4 || 
      params.email.length === 0 ) {
    res.send('Invalid data');
    return;
  }

  var bcrypt = require('bcrypt');
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(params.password, salt, function(err, hash) {
      var userdata = { 
        user: params.username, 
        pass: hash,
        email: params.email
      };

      db.table('users').insert(userdata).then(function () {
        // If registration was successful
        res.render('user/register_success', { user: params.username });
      }, function (err) {
        console.log('could not add user: ', err);
        res.render('user/register');
      });
    });
  });
});

router.get('/login', function (req, res) {
  var user = req.session.user;
  if(user) {
    res.render('user/login', { warn: user.user });
    return;
  }

  res.render('user/login');
});

router.post('/login', function (req, res) {
  var params  = req.body;
  var db      = req.db;

  // Basic check for parameters
  if(!params.username || !params.password) {
    res.render('user/login', { failed: true });
    return;
  }

  db.table('users').findOne({ user: params.username }).then(function (user) {
    if(!user) {
      res.render('user/login', { failed: true });
      return;
    }

    var bcrypt = require('bcrypt');
    bcrypt.compare(params.password, user.pass, function(err, result) {
      if(err || !result) {
        res.render('user/login', { failed: true });
        return;
      }

      // Log in user and redirect
      login_user(user, req, res);
      res.redirect('/lobby');
    });
  }, function (err) {
    console.log('db error finding user: ', err);
    res.render('user/login', { failed: true, dbError: true });
  });
});

router.get('/logout', function (req, res) {
  logout_user(req, res);
  res.redirect('/login');
});

router.get('/users/:id', function (req, res) {
  var id = req.params.id;
  res.json({
    'id': id,
    'name': 'gosukiwi',
    'str': 10,
    'agi': 10,
    'int': 10,
    'chakraNature': 'water',
    'hp': 2500,
    'currentHp': 1600,
    'level': 10,

    // The enabled jutsus for this user, all users have lots of jutsus but
    // they can only choose four when dueling.
    'jutsus': [
      {
        name: 'Gokakyou no jutsu',
        damage: 200,
        element: 'fire',
        type: 'ninjutsu',
        description: 'Some desc...'

      },
      {
        name: 'Replacemente jutsu',
        damage: 200,
        element: 0,
        type: 'ninjutsu',
        description: 'Some desc...'

      },
      {
        name: 'Throw Kunai',
        damage: 200,
        element: 0,
        type: 'taijutsu',
        description: 'Some desc...'

      },
      {
        name: 'Body Flicker',
        damage: 200,
        element: 0,
        type: 'ninjutsu',
        description: 'Some desc...'
      }
    ]
  });
});

module.exports = router;
