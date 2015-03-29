Class('NeBootstrapClient').includes(CustomEventSupport)({
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

      this.socket.on('error', function _errorHandler(err) {
        if (err.description){
          console.error('Socket.io callback error:\n', err.description.toString(), '\n for event:\n',err.description.data.toString());
        }else{
          throw err;
        }
      });

    },

    _handleConnect : function _handleConnect(ev){
      console.log('Client connected.', this.config);
      this.dispatch('connected', {data : {
        socket : this.socket,
        config : this.config
      }});
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