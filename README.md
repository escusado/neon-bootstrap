# Neon Bootstrap

New handler pattern added

[Express] "/" > index.html ([with config object printed](https://github.com/escusado/neon-bootstrap/blob/master/views/index.html#L26))
[Socket.io client] connect + clientId > `server.clients[clientId] = new ClientHandler({socket: socket});`

Full evented api over socket.io.

Every App will have a front-end client and an AppHandler on the back

[client] -[socket.io event + .data]-> [server AppHandler] has handlers for all events.

# Usage

## Clone:
```bash
$ git clone git@github.com:escusado/neon-bootstrap.git
```

## Deps:
```bash
$ npm install
```

```bash
$ bower install
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