import EventEmitter from 'events';
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
}

export { Client };
