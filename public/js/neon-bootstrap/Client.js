Class('Client').includes(CustomEventSupport)({
  prototype : {

    socket : null,

    init : function init(config){

      Object.keys(config || {}).forEach(function (property) {
        this[property] = config[property];
      }, this);

      return true;
    },

    setup : function setup(){
      console.log('Client connecting...');
      this.socket = io.connect({
        reconnect: false,
        query:'clientId='+this.config.clientId
      });

      this._bindEvents();
    },

    _bindEvents : function _bindEvents(){
      this.socket.on('connect', this._handleConnect.bind(this));
      this.socket.on('disconnect', this._handleDisconnect.bind(this));
    },

    _handleConnect : function _handleConnect(ev){
      console.log('Client connected.');
      this.dispatch('connected')
    },

    _handleDisconnect : function _handleDisconnect(){
      console.log('Client disconnected, reconnecting...');
      this.socket = io.connect({
        reconnect: false,
        query:'clientId='+this.config.clientId
      });
    }
  }
});