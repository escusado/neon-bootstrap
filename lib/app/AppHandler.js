module.exports = Class({},'AppHandler')({
  prototype : {

    socket : null,
    clientId : null,

    init : function init(config){

      Object.keys(config || {}).forEach(function (property) {
        this[property] = config[property];
      }, this);

      return true;
    },

    setup : function setup(){
      this._bindEvents();
    },

    reconnect : function reconnect(config){
      console.log('> handle reconnect to your AppHandler', config);
    },

    destroy : function destroy(cb){
      if(cb){
        cb();
      }
    },

    _bindEvents : function _bindEvents(){
      this.socket.on('app_handshake_intent', this._handleAppHandshakeIntent.bind(this));
    },

    _handleAppHandshakeIntent : function _handleAppHandshakeIntent(ev){
      if (ev.data.clientId) { //any validation, auth?
        this.clientId = ev.data.clientId;
      }
      this.socket.emit('app_acknowledge-'+this.clientId,{
        data : {
          bootstrap : {
            appData1 : 'value1',
            appData2 : 'value2'
          }
        }
      });

      console.log('New connection from client: ', ev);
    }
  }
});