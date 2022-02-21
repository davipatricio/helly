import EventEmitter from 'events';
import { Events } from '../constants/Events';
import { CacheManager } from '../managers/CacheManager';
import { GuildManager } from '../managers/GuildManager';
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

/** The main hub for interacting with the Discord API, and the starting point for any bot */
class Client extends EventEmitter {
  /**
   * ActionManager is responsible for handling all events that are dispatched by the Gateway
   * @private
   */
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
  // TODO: Add links to respective structures
  /** Stores caches of Guilds, Roles, Members, Channels and Messages */
  caches: CacheManager;
  /** Manages API methods for Guilds */
  guilds: GuildManager;
  /** @param [options] - The options for the client */
  constructor(options = {} as Partial<ClientOptions>) {
    super();

    this.actions = new ActionManager();
    this.ws = new WebsocketManager(this);

    this.options = Object.assign(defaultClientOptions, options);
    this.options.intents = this.options.intents instanceof Intents ? this.options.intents.bitfield : new Intents(this.options.intents).parse();

    this.#prepareCaches();

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
  login(token: string) {
    if (typeof token !== 'string') throw new Error('A token is required and must be a string');
    this.token = token;
    this.emit(Events.Debug, '[DEBUG] Login method was called. Preparing to connect to the Discord Gateway.');
    this.ws.connect();
    return token;
  }

  /** Returns whether the client has logged in, indicative of being able to access properties such as user and application */
  isReady() {
    return this.ready === true;
  }

  /**
   * Emits `Client#Reconnecting` and calls `Client.login()` again
   * @private
   */
  reconnect() {
    // Stop heartbeating (this automatically verifies if there's a timer)
    Heartbeater.stop(this);

    this.cleanUp();
    this.emit(Events.Reconnecting);

    // If we don't have a session id, we cannot reconnect
    this.api.shouldResume = Boolean(this.api.sessionId);
    return this.login(this.token);
  }

  /** @private */
  cleanUp() {
    this.ping = 0;
    this.caches.destroy();
  }

  /** @private */
  #prepareCaches() {
    this.caches = new CacheManager(this, this.options.caches);
    this.guilds = new GuildManager(this);
  }

  override on(event: string | symbol, listener: (...args: any[]) => void): this;
  override on(event: Events.Ready, listener: (client: Client) => any): this;
  override on(event: Events.Debug, listener: (information: string) => any): this;
  override on(event: Events.GuildCreate, listener: (information: string) => any): this;
  override on(event: 'Ready', listener: (client: Client) => any): this;
  override on(event: 'Debug', listener: (information: string) => any): this;
  override on(event: 'GuildCreate', listener: (information: string) => any): this;
  override on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  override once(event: string | symbol, listener: (...args: any[]) => void): this;
  override once(event: Events.Ready, listener: (client: Client) => any): this;
  override once(event: Events.Debug, listener: (information: string) => any): this;
  override once(event: Events.GuildCreate, listener: (information: string) => any): this;
  override once(event: 'Ready', listener: (client: Client) => any): this;
  override once(event: 'Debug', listener: (information: string) => any): this;
  override once(event: 'GuildCreate', listener: (information: string) => any): this;
  override once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }
}

export { Client };
