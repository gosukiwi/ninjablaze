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
  host:     'localhost',
  user:     'root',
  password: 'root',
  database: 'ninjablaze'
}));

// Routes
// ---------------------------------------------------------------------------
var userRouter  = require('./routes/user');
var lobbyRouter = require('./routes/lobby');
var gameRouter  = require('./routes/game');
var jutsuRouter = require('./routes/jutsu');

app.get('/', function(req, res){
  res.render('index');
});

app.use('/', lobbyRouter);
app.use('/', gameRouter);
app.use('/', userRouter);
app.use('/', jutsuRouter);

// Websockets
// Eventually they could go into their own node instance if needed.
// ---------------------------------------------------------------------------
require('./ws/index')(http);

// Start server on port 3000
// ---------------------------------------------------------------------------
http.listen(3000, function(){
  console.log('listening on *:3000');
});
