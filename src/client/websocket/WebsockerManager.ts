import WebSocket from 'ws';
import type { Client } from '../Client';
import Parser from './Parser';

class WebsocketManager {
  connection: WebSocket;
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  connect() {
    this.connection = new WebSocket(`${this.client.options.ws.gateway}?v=${this.client.options.ws.version}&encoding=json`);
    this.connection.on('message', (data: WebSocket.RawData) => {
      if (this.connection.readyState !== WebSocket.OPEN) return;
      Parser.message(this.client, data);
    });
  }
}

export { WebsocketManager };
