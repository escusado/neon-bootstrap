Class('App').inherits(Widget)({

  ELEMENT_CLASS : 'app',

  prototype : {
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

      console.log('Neonbootstrapped!');
    },

    setup : function setup(){
      this.sidebar.render(this.element);
      this.body.render(this.element);
    }
  }
});