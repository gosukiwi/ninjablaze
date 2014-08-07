'use strict';

var express     = require('express');
var app         = express();
var http        = require('http').Server(app);
var bodyParser  = require('body-parser');
var session     = require('express-session');
var cookies     = require('cookie-parser');
var dbal        = require('./lib/dbal-mysql/src/middleware');

// Configuration
// ---------------------------------------------------------------------------
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Middleware
// ---------------------------------------------------------------------------
app.use('/assets', express.static('web'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'sa_10\'=_1@´ñBQp-.aS1lPoAds,ñlb'
}));
app.use(cookies());
app.use(dbal({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ninjablaze'
}));

// Routes
// ---------------------------------------------------------------------------
var user  = require('./routes/user');
var lobby = require('./routes/lobby');
var game  = require('./routes/game');

app.get('/', function(req, res){
  res.render('index');
});

// Lobby Routes
app.get('/lobby', lobby.index);

// Game Routes
app.get('/duel/:p1/vs/:p2', game.duel);

// User routes
app.get('/register', user.register);
app.post('/register', user.register_action);
app.get('/login', user.login);
app.post('/login', user.login_action);
app.get('/logout', user.logout);


// Websockets
// ---------------------------------------------------------------------------
require('./ws/lobby.js')(http);

// Start server on port 3000
// ---------------------------------------------------------------------------
http.listen(3000, function(){
  console.log('listening on *:3000');
});
