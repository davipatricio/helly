import type { GatewayIdentifyData } from 'discord-api-types/v10';
import EventEmitter from 'events';
import WebSocket from 'ws';
import { handleIncomingMessage } from '../utils';

interface WebSocketClientOptions extends GatewayIdentifyData {
  url: string;
}

interface WebSocketClientData {
  heartbeater: NodeJS.Timeout | null;
  heartbeatInterval: number;
  lastHeartbeatAck: boolean;
  lastHeartbeatTime: number;
  resumeGatewayUrl: string | null;
  sequence: number | null;
  sessionId: string | null;
}

export class WebSocketClient extends EventEmitter {
  data: WebSocketClientData;
  options: WebSocketClientOptions;
  ws?: WebSocket;
  constructor(options?: Partial<WebSocketClientOptions>) {
    super();
    this.#applyDefaultOptions(options);

    this.data = {
      heartbeater: null,
      heartbeatInterval: 0,
      lastHeartbeatAck: false,
      lastHeartbeatTime: 0,
      resumeGatewayUrl: null,
      sequence: null,
      sessionId: null,
    };
  }

  #addListeners() {
    if (!this.ws) throw new Error('WebSocket not initialized yet');

    this.ws.on('open', () => this.emit('open'));
    this.ws.on('message', data => {
      handleIncomingMessage(this, data);
      this.emit('raw', data);
    });
    this.ws.on('close', (code, reason) => this.emit('close', code, reason));
    this.ws.on('error', error => this.emit('error', error));
  }

  #applyDefaultOptions(options?: Partial<WebSocketClientOptions>) {
    this.options = {
      ...options,
      ...{
        intents: 0,
        properties: {
          browser: 'helly',
          device: 'helly',
          os: process.platform,
        },
        token: '',
        url: 'wss://gateway.discord.gg',
      },
    };
  }

  connect() {
    this.ws = new WebSocket(this.options.url);
    this.#addListeners();
  }
}
