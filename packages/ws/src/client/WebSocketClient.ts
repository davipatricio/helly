import type { GatewayIdentifyData } from 'discord-api-types/v10';
import EventEmitter from 'events';
import WebSocket from 'ws';
import { handleIncomingMessage } from '../utils';

export interface WebSocketClientOptions extends GatewayIdentifyData {
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
  socket?: WebSocket;
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
    if (!this.socket) throw new Error('WebSocket not initialized yet');

    this.socket.on('open', () => this.emit('open'));
    this.socket.on('message', data => {
      handleIncomingMessage(this, data);
      this.emit('raw', data);
    });
    this.socket.on('close', (code, reason) => this.emit('close', code, reason));
    this.socket.on('error', error => this.emit('error', error));
  }

  #applyDefaultOptions(options?: Partial<WebSocketClientOptions>) {
    this.options = {
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
      ...options,
    };
  }

  connect() {
    this.socket = new WebSocket(this.options.url);
    this.#addListeners();
  }
}
