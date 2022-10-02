import { RateLimit, RateLimitManager } from '@sapphire/ratelimits';
import { GatewayCloseCodes, GatewayIdentifyData, GatewaySendPayload } from 'discord-api-types/v10';
import EventEmitter from 'events';
import WebSocket from 'ws';
import { handleIncomingMessage } from '../utils';
import type { ClientEvents } from './ClientEvents';
import { MessageReader } from './MessageReader';

type Awaitable<T> = T | Promise<T>;

export interface WebSocketClientOptions extends GatewayIdentifyData {
  /**
   * The WebSocket URL to connect to
   */
  url: string;
}

const Codes = {
  AllowReconnect: [
    GatewayCloseCodes.UnknownError,
    GatewayCloseCodes.UnknownOpcode,
    GatewayCloseCodes.DecodeError,
    GatewayCloseCodes.NotAuthenticated,
    GatewayCloseCodes.AlreadyAuthenticated,
    GatewayCloseCodes.RateLimited,
  ],
};

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
  /**
   * Useful data for the client
   */
  data: WebSocketClientData;
  /**
   * Reads messages incoming from the WebSocket.
   * Also decomperesses and parses binary messages
   */
  #messageReader: MessageReader;
  /**
   * The options the client was instantiated with
   */
  options: WebSocketClientOptions;
  /**
   * A class that handles ratelimits
   */
  ratelimit: RateLimit;
  /**
   * The WebSocket object. Only available when {@link WebSocketClient#connect} is been called
   */
  socket?: WebSocket;
  /**
   * @param options The options for the client
   * @example
   * ```js
   * const client = new WebSocketClient({
   *  url: 'wss://gateway.discord.gg',
   *  token: 'my token',
   *  intents: 513,
   * });
   * ```
   * @example
   * ```js
   * const client = new WebSocketClient({
   *  url: 'wss://gateway.discord.gg/?v=10&encoding=json',
   *  token: 'my token',
   *  intents: 0,
   * });
   * ```
   */
  constructor(options?: Partial<WebSocketClientOptions>) {
    super();
    this.#applyDefaultOptions(options);
    this.cleanUp();

    // Clients are allowed to send 120 gateway commands every 60 seconds, meaning you can send an average of 2 commands per second
    this.ratelimit = new RateLimit(new RateLimitManager(60_000, 120));
    this.#messageReader = new MessageReader();
  }

  #addListeners() {
    if (!this.socket) throw new Error('WebSocket not initialized yet');

    this.socket.on('close', (code, reason) => {
      this.emit('Close', code, reason);

      if (code && !Codes.AllowReconnect.includes(code)) this.cleanUp();
      else this.connect();
    });
    this.socket.on('error', error => this.emit('Error', error));
    this.socket.on('message', data => {
      const parsedMessage = this.#messageReader.read(data, this.options.compress);
      handleIncomingMessage(this, parsedMessage);
      this.emit('Message', parsedMessage);
    });
    this.socket.on('open', () => this.emit('Open'));
  }

  #applyDefaultOptions(options?: Partial<WebSocketClientOptions>) {
    this.options = {
      ...{
        compress: false,
        intents: 0,
        properties: {
          browser: 'helly',
          device: 'helly',
          os: process.platform,
        },
        token: '',
        url: 'wss://gateway.discord.gg/?v=10&encoding=json',
      },
      ...options,
    };
  }

  /**
   * Sets the `client.data` property to its default values. Not recommended to be used outside of the library
   */
  cleanUp() {
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

  /**
   * Connects to the WebSocket and sets up the listeners
   */
  connect() {
    this.socket = new WebSocket(this.options.url);
    this.#addListeners();
  }

  /**
   * Disconnects from the WebSocket with the specified code
   */
  disconnect(code = 1000) {
    if (!this.socket) throw new Error('WebSocket not initialized yet');
    this.socket.close(code);
  }

  override emit<K extends keyof ClientEvents>(event: K, ...args: any[]);
  override emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: any[]);
  override emit(event: string | symbol, ...args: any[]) {
    return super.emit(event, ...args);
  }

  override off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>);
  override off<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaitable<void>);
  override off(event: string | symbol, listener: (...args: any[]) => void) {
    return super.off(event, listener);
  }

  override on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>);
  override on<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaitable<void>);
  override on(event: string | symbol, listener: (...args: any[]) => void) {
    return super.on(event, listener);
  }

  override once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>);
  override once<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaitable<void>);
  override once(event: string | symbol, listener: (...args: any[]) => void) {
    return super.once(event, listener);
  }

  override removeAllListeners<K extends keyof ClientEvents>(event?: K);
  override removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>);
  override removeAllListeners(event: string | symbol) {
    return super.removeAllListeners(event);
  }

  /**
   * Sends data to the WebSocket
   * @param data The data to send
   */
  send(data: string | GatewaySendPayload | unknown[]) {
    if (!this.socket) throw new Error('WebSocket not initialized yet');

    if (this.ratelimit.limited) {
      this.emit('Debug', `Ratelimited while sending a Gateway Command, waiting for ${this.ratelimit.remainingTime}ms...`);
      setTimeout(() => this.send(data), this.ratelimit.remainingTime);
      return;
    }

    this.ratelimit.consume();
    if (typeof data === 'string') {
      this.socket.send(data);
    } else this.socket.send(JSON.stringify(data));
  }
}
