#! /usr/local/bin/node

//Deps
var neon = require('neon'),
    commander = require('commander'),
    exec = require('child_process').exec,
    fs = require('fs');

//App
Class('AppRenamer')({
  prototype : {

    files : null,

    repository : 'no-repo',

    name : null,
    camelizedName : null,
    renameTasks : null,

    init : function init(config){

      Object.keys(config || {}).forEach(function (property) {
        this[property] = config[property];
      }, this);

      if(typeof config.name === 'string'){
        console.log('> Name present: ', config.name);
        this.name = config.name
        this._start();
      }else{
        console.log('> Getting name from git repo... ');
        this._getGitData(this._start.bind(this));
      }

      return true;
    },

    _start : function _start(){
      this.camelizedName = camelize(this.name);
      console.log('> Camelized name: ', this.camelizedName);
      this._loadFiles();
      this._replaceContent();
      this._writeFiles();
      this._renameFiles();
      console.log('> Project uccesfully renamed to:', this.name);
    },

    _getGitData : function _getGitData(cb){
      exec('echo { \\"name\\" : \\" && basename `git rev-parse --show-toplevel` && echo \\", \\"repository\\": \\" && git config --get remote.origin.url && echo \\" }', function handleMaskCreation(error, stdout, stderr) {
        var data = JSON.parse(stdout.replace(/\n/g, ''));

        console.log('> Git repo: ', data);
        this.name = data.name;
        this.repository = data.repository;
        cb();
      }.bind(this));
    },

    _loadFiles : function _loadFiles(){
      this.files = {
        'package.json' : JSON.parse(fs.readFileSync('package.json')),
        'bower.json'   : JSON.parse(fs.readFileSync('bower.json')),
        'README.md'    : fs.readFileSync('README.md', 'utf-8'),
        'bin/server.js' : fs.readFileSync('bin/server.js', 'utf-8'),
        'lib/app/AppHandler.js' : fs.readFileSync('lib/app/AppHandler.js', 'utf-8'),
        'public/js/app/App.js' : fs.readFileSync('public/js/app/App.js', 'utf-8'),
        'views/index.html' : fs.readFileSync('views/index.html', 'utf-8')
      };

      this.renameTasks = {
        'lib/app/AppHandler.js' : 'lib/app/'+this.camelizedName+'Handler.js',
        'public/js/app/App.js'  : 'public/js/app/'+this.camelizedName+'.js',
      };
    },

    _replaceContent : function _replaceContent(){
      this._processPackageJson();
      this._processBowerJson();
      this._processReadmeMd();
      this._processServerJs();
      this._processAppHandlerJs();
      this._processAppJs();
      this._processIndex();
      console.log('> Content updated');
    },

    _writeFiles : function _writeFiles(){
      fs.writeFileSync('package.json', JSON.stringify(this.files['package.json'], null, 4));
      delete this.files['package.json'];
      console.log('> File Written: package.json');
      fs.writeFileSync('bower.json', JSON.stringify(this.files['bower.json'], null, 4));
      delete this.files['bower.json'];
      console.log('> File Written: bower.json');

      Object.keys(this.files).forEach(function(filename){
        fs.writeFileSync(filename, this.files[filename]);
        console.log('> File Written:', filename);
      }, this);
    },

    _processPackageJson : function _processPackageJson(){
      this.files['package.json'].name = this.name;
      this.files['package.json'].description = 'Project: '+this.name+', repository: '+this.repository;
      this.files['package.json'].repository = this.repository;
    },

    _processBowerJson : function _processBowerJson(){
      this.files['bower.json'].name = this.name;
      this.files['bower.json'].description = 'Project: '+this.name+', repository: '+this.repository;
      this.files['bower.json'].repository = this.repository;
    },

    _processReadmeMd : function _processReadmeMd(){
      this.files['README.md'] = this.files['README.md'].replace(/Neon Bootstrap/g, this.name)
                                                       .replace('git@github.com:escusado/neon-bootstrap.git', this.repository);
    },

    _processServerJs : function _processServerJs(){
      this.files['bin/server.js'] = this.files['bin/server.js'].replace(/AppHandler/g, this.camelizedName+'Handler');
    },

    _processAppHandlerJs : function _processAppHandlerJs(){
      this.files['lib/app/AppHandler.js'] = this.files['lib/app/AppHandler.js'].replace(/App/g, this.camelizedName);
    },

    _processAppJs : function _processAppJs(){
      this.files['public/js/app/App.js'] = this.files['public/js/app/App.js'].replace(/App/g, this.camelizedName);
    },

    _processIndex : function _processIndex(){
      this.files['views/index.html'] = this.files['views/index.html'].replace(/App/g, this.camelizedName);
    },

    _renameFiles : function _renameFiles(){
      Object.keys(this.renameTasks).forEach(function(originalFilename){
        var newName = this.renameTasks[originalFilename];
        fs.renameSync(originalFilename, newName);
        console.log('> Renamed %s to %s', originalFilename, newName);
      }, this);
    }

  }
});

global.appReanamer = new AppRenamer({
  name: commander.option('-n, --name <name>', 'App name').parse(process.argv).name
});

//Utils
function camelize(str) {return str.split('-').map(function(item){
  var item = item.charAt(0).toUpperCase() + item.substr(1, item.length-1)
  return item;
}).join('')};