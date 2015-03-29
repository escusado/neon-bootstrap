module.exports = Class({},'AppHandler')({
  prototype : {

    client : null,
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

    _bindEvents : function _bindEvents(){
      this.client.on('new_session_intent', this._handleNewSessionIntent.bind(this));
    },

    _handleNewSessionIntent : function _handleNewSessionIntent(ev){
      console.log('New session for client: ', ev.data.clientId);
      if (ev.data.clientId) { //any validation, auth?
        this.clientId = ev.data.clientId;
      }
      this.client.emit('new_session'+this.clientId);
      console.log('>>>>>');
    }
  }
});