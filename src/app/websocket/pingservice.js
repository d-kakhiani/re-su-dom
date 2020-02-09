const config = require('../config');

class PingService {
  constructor(webSocket) {
    this.webSocket = webSocket;
    this.webSocket.on('connection', this._newConnection.bind(this));
  }

  start() {
    this.pingInterval = setInterval(this._broadcastPing.bind(this),
        config.webSocket.pingInterval);
  }

  stop() {
    clearInterval(this.pingInterval);
  }

  _newConnection(ws) {
    ws.isAlive = true;
    ws.on('pong', () => ws.isAlive = true);
  }

  _broadcastPing() {
    this.webSocket.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping(() => {
      });
    });
  }
}

module.exports = PingService;
