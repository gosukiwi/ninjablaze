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
  res.render('user/register', { token: req.csrfToken() });
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
        res.render('user/register', { token: req.csrfToken() });
      });
    });
  });
});

router.get('/login', function (req, res) {
  var user = req.session.user;
  var warn = null;
  if(user) {
    warn = user.user;
  }

  res.render('user/login', { warn: warn, token: req.csrfToken() });
});

router.post('/login', function (req, res) {
  var params  = req.body;
  var db      = req.db;

  // Basic check for parameters
  if(!params.username || !params.password) {
    res.render('user/login', { token: req.csrfToken(), failed: true });
    return;
  }

  db.table('users').findOne({ user: params.username }).then(function (user) {
    if(!user) {
      res.render('user/login', { token: req.csrfToken(), failed: true });
      return;
    }

    var bcrypt = require('bcrypt');
    bcrypt.compare(params.password, user.pass, function(err, result) {
      if(err || !result) {
        res.render('user/login', { token: req.csrfToken(), failed: true });
        return;
      }

      // Log in user and redirect
      login_user(user, req, res);
      res.redirect('/lobby');
    });
  }, function (err) {
    console.log('db error finding user: ', err);
    res.render('user/login', { token: req.csrfToken(), failed: true, dbError: true });
  });
});

router.get('/logout', function (req, res) {
  logout_user(req, res);
  res.redirect('/login');
});

// JSON Responses
// ---------------------------------------------------------------------------
router.get('/users/:id', function (req, res) {
  var id = req.params.id;
  req.db.table('users').findOne(id).then(function (user) {
    delete user.pass;
    delete user.token;

    // TODO: Load this from database...
    user.jutsus = [
      {
        name: 'Gokakyou no jutsu',
        damage: 50,
        element: 'fire',
        type: 'ninjutsu',
        description: 'Throws a fireball at the enemy',
        effect_type: 'none',
        effect_duration: 0,
        effect_damage: 0,
      },
      {
        name: 'Throw Poisonous Kunai',
        damage: 20,
        element: 0,
        type: 'taijutsu',
        description: 'Throws a poisonous kunai',
        effect_type: 'poison',
        effect_duration: 2,
        effect_damage: 100,
      },
      {
        name: 'Throw Kunai',
        damage: 20,
        element: 0,
        type: 'taijutsu',
        description: 'Throws a fireball at the enemy',
        effect_type: 'none',
        effect_duration: 0,
        effect_damage: 0,
      },
      {
        name: 'Potato no jutsu',
        damage: 30,
        element: 0,
        type: 'genjutsu',
        description: 'Throws a fireball at the enemy',
        effect_type: 'none',
        effect_duration: 0,
        effect_damage: 0,
      }
    ];

    res.json(user);
  }, function (err) {
    console.log(err);
    res.json({ error: 'There has been an error with our database, please try again soon' });
  });
});

module.exports = router;
