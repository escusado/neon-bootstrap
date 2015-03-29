# Neon Bootstrap v2

Single page web app framework, `scoket.io` events <> Event Handlers.

For Server Framework check [NeoNode](https://github.com/sgarza/Neonode)

> Important changes: new Event API (Wdiget events <-> backend handler) system

New handler pattern added

`[Express] "/"` -> index.html ([with config object printed](https://github.com/escusado/neon-bootstrap/blob/master/views/index.html#L26))

`[Socket.io client] connect + clientId` > `server.clients[clientId] = new ClientHandler({socket: socket});`

Full evented api over socket.io.

Every App will have a front-end client and an AppHandler on the back

[client] -[socket.io event + .data]-> [server AppHandler] has handlers for all events.

# Usage

## Clone:
```bash
$ git clone git@bitbucket.org:escusado/telemetry.git
```

## Deps:
```bash
$ npm install
```

```bash
$ bower install
```

## Rename project (optional)
It will rename all the info and code strings to the projectname.

ej.


```javascript
//instead of default

window.app = new App();

//will transform to

window.app = new ProjectName()

//It will rename also:
'lib/app/AppHandler.js' to 'lib/app/ProjectNameHandler.js'
'public/js/app/App.js'  to 'public/js/app/ProjectName.js'

```

```
npm run rename_app
```

or

```
npm run rename_app -- -n project-name-separated-by-hiphens
```

If no nanme is passed name and repo will be grabbed from the .git folder


```bash
$ npm run rename_app

> neon-bootsrap@0.1.0 rename_app /Users/Toily/code/my-new-project
> node bin/tasks/rename_app.js

> Getting name from git repo...
> Git repo:  { name: 'my-new-project',
  repository: 'git@github.us:escusado/my-new-project.git' }
> Camelized name:  MyNewProject
> Content updated
> File Written: package.json
> File Written: bower.json
> File Written: README.md
> File Written: bin/server.js
> File Written: lib/app/AppHandler.js
> File Written: public/js/app/App.js
> File Written: views/index.html
> Renamed lib/app/AppHandler.js to lib/app/MyNewProjectHandler.js
> Renamed public/js/app/App.js to public/js/app/MyNewProject.js
> Project uccesfully renamed to: my-new-project
```

## Configs:
```
Edit config/server.json config/client.json
```
client.config gets to frontend `App.js` as .config where you can consume it.

Connection and reconnection is handled by the `NeBootstrapClient.js` Class.
A simple identity is created per client to handle reconnect and socket instance sync.

[printed in the `config`](https://github.com/escusado/neon-bootstrap/blob/master/bin/server.js#L74)  template variable [on `index.html`](https://github.com/escusado/neon-bootstrap/blob/master/views/index.html#L26)

## Run:
```bash
npm start
```


# [2015-03-29] : Update

- New jQueryless Widget (based on the [Horror one](https://github.com/noeldelgado/shadowlord/blob/23f8799f82d259e0354dd58f36bbcbc6d608da02/dist/js/app.js#L902-L1193))
- Added start script `npm start`
- Added rename project feature task (changes relevant strings and filenames to replace 'neon-bootstrap' to 'project-name') defailts to .git contents
- New Event API philosophy (frontend `Widgets`, emit events (socket.io) to an `AppHandler`, that contains all handlers for them).
- Client disconnect management through the `.reconnect(<new socket>)` method.

# TODO
- Build system a'la neonode global tool and an initter