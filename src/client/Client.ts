import EventEmitter from 'events';
import type { Events } from '../constants/Events';
import { Intents } from '../utils/Intents';
import { ActionManager } from './actions/ActionManager';
import { ClientOptions, defaultClientOptions } from './ClientOptions';
import * as Heartbeater from './websocket/Heartbeater';
import { WebsocketManager } from './websocket/WebsockerManager';

interface ClientAPI {
  shouldResume: boolean;
  heartbeatInterval: number | null;
  sessionId: string | null;
  sequence: number | null;
  heartbeatAcked: boolean;
  lastHeartbeatAck: number | null;
  lastHeartbeat: number | null;
  heartbeatTimer: NodeJS.Timer | null;
}

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot
 */
class Client extends EventEmitter {
  /** @private */
  actions: ActionManager;
  /** @private */
  ws: WebsocketManager;
  /** The options the client was instantiated with */
  options: ClientOptions;
  /** @private */
  api: ClientAPI;
  /** Whether the client has logged in */
  ready: boolean;
  /** Authorization token for the logged in bot */
  token: string;
  /** The previous heartbeat ping of the {@link Client} */
  ping: number;
  /** @param options - The options for the client */
  constructor(options = {} as Partial<ClientOptions>) {
    super();

    this.actions = new ActionManager();
    this.ws = new WebsocketManager(this);
    this.options = Object.assign(defaultClientOptions, options);
    this.options.intents = Intents.parse(this.options.intents);

    this.api = {
      shouldResume: false,
      heartbeatInterval: null,
      sessionId: null,
      sequence: null,
      heartbeatAcked: false,
      lastHeartbeatAck: null,
      lastHeartbeat: null,
      heartbeatTimer: null,
    };

    this.ready = false;
    this.token = '';
    this.ping = 0;
  }

  /**
   * Logs the client in, establishing a WebSocket connection to Discord
   * @param token - Token of the account to log in with
   */
  async login(token: string): Promise<string> {
    if (typeof token !== 'string') throw new Error('A token is required and must be a string');
    this.token = token;
    this.emit('debug', '[DEBUG] Login method was called. Preparing to connect to the Discord Gateway.');
    await this.ws.connect();
    return token;
  }

  /**
   * Returns whether the client has logged in, indicative of being able to access properties such as user and application
   */
  isReady() {
    return this.ready === true;
  }

  /**
   * Emits `Client#reconnecting` and calls `Client.login()` again
   * @private
   */
  reconnect() {
    // Stop heartbeating (this automatically verifies if there's a timer)
    Heartbeater.stop(this);

    this.cleanUp();
    this.emit('reconnecting');

    // If we don't have a session id, we cannot reconnect
    this.api.shouldResume = Boolean(this.api.sessionId);
    this.login(this.token);
  }

  /** @private */
  cleanUp() {
    this.ping = 0;
  }

  override on(event: string | symbol, listener: (...args: any[]) => void): this;
  override on(event: Events.READY, listener: (client: Client) => any): this;
  override on(event: Events.DEBUG, listener: (information: string) => any): this;
  override on(event: 'ready', listener: (client: Client) => any): this;
  override on(event: 'debug', listener: (information: string) => any): this;
  override on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  override once(event: string | symbol, listener: (...args: any[]) => void): this;
  override once(event: Events.READY, listener: (client: Client) => any): this;
  override once(event: Events.DEBUG, listener: (information: string) => any): this;
  override once(event: 'ready', listener: (client: Client) => any): this;
  override once(event: 'debug', listener: (information: string) => any): this;
  override once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }
}

export { Client };
