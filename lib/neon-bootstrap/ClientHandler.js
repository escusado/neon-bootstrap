module.exports = Class({},'ClientHandler').includes(CustomEventSupport)({
  prototype : {

    socket : null,
    clientId : null,

    init : function init(config){

      Object.keys(config || {}).forEach(function (property) {
        this[property] = config[property];
      }, this);

      this._bindEvents();

      return true;
    },

    // emit : function emit(ev, data){
    //   var event = {
    //     type : ev,
    //     data : data
    //   };
    //   this.socket.emit(this.config.clientId, event);
    // },

    // on : function on(ev, cb){
    //   this.bind(ev, cb);
    //   this.socket.on(this.config.clientId, function(ev){
    //     this.dispatch(ev.type, ev.data);
    //     if(cb.__once){
    //       this.unbind(ev, cb);
    //     }
    //   }.bind(this));
    // },

    once : function once(ev, cb){
      cb.__once = true;
      this.on(ev, cb);
    },

    _bindEvents : function _bindEvents(){
      this.socket.on(this.clientId, this._handleMessage.bind(this));
    },

    _handleMessage : function _handleMessage(ev){
      console.log('dispatched: ',ev.type, ev.data);
      this.dispatch(ev.type, ev.data);
    }
  }
});