module.exports = Class({},'ClientHandler')({
  prototype : {
    init : function init(config){

      Object.keys(config || {}).forEach(function (property) {
        this[property] = config[property];
      }, this);

      return true;
    }
  }
});