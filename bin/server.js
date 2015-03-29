#! /usr/local/bin/node

//Deps
var neon = require('neon');
    fs = require('fs'),
    path = require('path'),
    Express = require('express'),
    Http= require('http'),
    Socket_io = require('socket.io'),
    commander = require('commander'),
    uuid = require('node-uuid'),

    ClientHandler = require('../lib/neon-bootstrap/ClientHandler.js');

//Config
var config = commander.option('-c, --config <config>', 'User config').parse(process.argv).config;

//App
Class('Server')({
  prototype : {

    config : null,
    app : null,
    server : null,
    io : null,

    viewsFolder : null,

    _clients : null,

    init : function init(config){

      Object.keys(config || {}).forEach(function (property) {
        this[property] = config[property];
      }, this);

      this._clients = [];

      return true;
    },

    setup : function setup(){
      this._setupApp();
      this._setRoutes();
      this._setSockets();
    },

    start : function start(){
      console.log('Neon Bootstrap: listening on port: ', this.config.port);
      this.server.listen(this.config.port);
    },

    _setupApp : function _setupApp(){
      this.app     = Express(),
      this.server  = Http.createServer(this.app),
      this.io      = Socket_io(this.server);

      //Static routes
      // this.app.use('/bower_components', this.server.static('bower_components'));
      this.app.use(Express.static('bower_components'));
      this.app.use(Express.static('public'));
    },

    _setRoutes : function _setRoutes(){
      this.app.get('/', this._handleRoot.bind(this));
    },

    _handleRoot : function _handleRoot(req, res, err){
      var indexFile = fs.readFileSync('views/index.html', 'utf-8'),
          clientConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname+'/..', this.config.clientConfig)))

      clientConfig.clientId = 'client-'+uuid.v4();

      indexFile = indexFile.replace('{{client_config}}', JSON.stringify(clientConfig));
      res.end(indexFile);
    },

    _setSockets : function _setSockets(){
      this.io.on('connection', function socketHandler(socket) {
        var clientId = socket.handshake.query.clientId;

        if(this._clients[clientId]){
          console.log('\n\n\n----------------------------------------------------------\n> Reconnection for clientId: ', clientId);
          this._clients[clientId].reconnect(socket);
        }else{
          console.log('\n\n\n----------------------------------------------------------\n> New client for clientId: ', clientId);
          this._clients[clientId] = new ClientHandler({
            socket : socket
          });
        }

      }.bind(this));
    }
  }
});

global.server = new Server({
  config : JSON.parse(fs.readFileSync(path.resolve(__dirname+'/..', config)))
});

server.setup();
server.start();

//Config
// var serverPort = process.env.PORT || 3000;

// //Dependencies
// var express = require('express'),
// http    = require('http'),
// app     = express(),
// server  = http.createServer(app),
// io      = require('socket.io').listen(server),
// fs      = require('fs');
// require('neon');

// //Application
// Class('Server')({
//   prototype : {

//     init : function init (){
//       this._configureApp();
//       this._setRoutes();
//       this._setupSockets();
//       this._serverStart();
//       return this;
//     },

//     _configureApp : function _configureApp(){
//       //neon
//       app.use('/neon', express.static('node_modules/neon'));

//       //CORS
//       app.use(function (req, res, next) {
//         res.header("Access-Control-Allow-Origin", "*");
//         res.header("Access-Control-Allow-Headers", "X-Requested-With");
//         next();
//       });

//       //Static routes
//       app.use('/assets', express.static('assets'));
//       app.use('/bower_components', express.static('bower_components'));

//       return this;
//     },

//     _setRoutes : function _setRoutes(){
//       app.get('/', function(req, res){
//         res.sendFile('views/index.html', {'root': __dirname + '/..'});
//       });

//       return this;
//     },

//     _setupSockets : function _setupSockets(){

//       io.sockets.on('connection', function (socket) {
//         socket.on('client:hello', this._clientHello.bind(this, socket));
//       }.bind(this));

//       return this;
//     },

//     _clientHello : function _clientHello(socket, data){
//       data.message = 'Server echo: '+ data.message;
//       socket.emit('server:echo', data);

//       return this;
//     },

//     _serverStart : function _serverStart(){
//       console.log('Server ready');
//       console.log('http://localhost:'+serverPort.toString());
//       server.listen(serverPort);

//       return this;
//     }

//   } //prototype
// });
// //Startup
// var server = new Server();
