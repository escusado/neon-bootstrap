Class('App').inherits(Widget)({

  HTML : '<div><div class="sidebar"></div><div class="body"></div></div>',

  ELEMENT_CLASS : 'app',

  prototype : {
    init : function(config){
      Widget.prototype.init.call(this, config);

      this._bindEvents();

      console.log('Send socket req...');
      this.socket.emit('client:hello', {
        message: 'sup!'
      });

      return;
    },

    _bindEvents : function(){
      this.socket.on('server:echo', this._handleEcho.bind(this));
    },

    _handleEcho : function(data){
      console.log(data.message);
    }
  }
});