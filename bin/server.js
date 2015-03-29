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