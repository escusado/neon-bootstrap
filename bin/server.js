#! /usr/local/bin/node

//Config
var serverPort = 3000;

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
        init : function (){
            this._configureApp();
            this._setRoutes();
            this._setupSockets();
            this._serverStart();

            return this;
        },

        _configureApp : function(){
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

            return this;
        },

        _setRoutes : function(){
            app.get('/', function(req, res){
                res.sendFile('views/index.html', {'root': __dirname + '/..'});
            });

            return this;
        },

        _setupSockets : function(){
            var server = this;

            io.sockets.on('connection', function (socket) {
                socket.on('client:hello', server._clientHello.bind(this, socket));
            });
        },

        _clientHello : function(socket, data){
            data.message = 'Server echo: '+ data.message;
            socket.emit('server:echo', data);
        },

        _serverStart : function(){
            console.log('Server ready');
            console.log('http://localhost:'+serverPort.toString());
            server.listen(serverPort);
        }
    }
});

//Startup
var server = new Server();
