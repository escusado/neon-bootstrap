#! /usr/local/bin/node

//Config
var serverPort = process.env.PORT || 3000;

//Dependencies
var express = require('express'),
http    = require('http'),
app     = express(),
server  = http.createServer(app),
io      = require('socket.io').listen(server),
fs      = require('fs');
require('neon');

//Application
Class('Server')({
  prototype : {

    init : function init (){
      this._configureApp();
      this._setRoutes();
      this._setupSockets();
      this._serverStart();
      return this;
    },

    _configureApp : function _configureApp(){
      //neon
      app.use('/neon', express.static('node_modules/neon'));

      //CORS
      app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
      });

      //Static routes
      app.use('/assets', express.static('assets'));
      app.use('/bower_components', express.static('bower_components'));

      return this;
    },

    _setRoutes : function _setRoutes(){
      app.get('/', function(req, res){
        res.sendFile('views/index.html', {'root': __dirname + '/..'});
      });

      return this;
    },

    _setupSockets : function _setupSockets(){

      io.sockets.on('connection', function (socket) {
        socket.on('client:hello', this._clientHello.bind(this, socket));
      }.bind(this));

      return this;
    },

    _clientHello : function _clientHello(socket, data){
      data.message = 'Server echo: '+ data.message;
      socket.emit('server:echo', data);

      return this;
    },

    _serverStart : function _serverStart(){
      console.log('Server ready');
      console.log('http://localhost:'+serverPort.toString());
      server.listen(serverPort);

      return this;
    }

  } //prototype
});
//Startup
var server = new Server();
