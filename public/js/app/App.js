Class('App').inherits(Widget)({

  ELEMENT_CLASS : 'app',

  prototype : {

    socket : null,
    config : null,

    init : function(config){
      Widget.prototype.init.call(this, config);

      this.appendChild(new Widget({
        name : 'sidebar',
        className : 'sidebar-container'
      }));

      this.appendChild(new Widget({
        name : 'body',
        className : 'body-container'
      }));
    },

    setup : function setup(){
      this.sidebar.render(this.element);
      this.body.render(this.element);

      this._bindEvents();

      this.socket.emit('app_handshake_intent', {
        data : {
          clientId : this.config.clientId
        }
      });
    },

    _bindEvents : function _bindEvents(){
      this.socket.once('app_acknowledge-'+this.config.clientId, this._handlerAppAcknowledge.bind(this));
    },

    _handlerAppAcknowledge : function _handlerAppAcknowledge(ev){
      console.log('AppHandler session acknowledge', ev.data);
      console.log('Neonbootstrapped!');
    }
  }
});