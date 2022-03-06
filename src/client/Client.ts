import EventEmitter from 'node:events';
import { Events } from '../constants/Events';
import { CacheManager } from '../managers/CacheManager';
import { ChannelManager } from '../managers/ChannelManager';
import { GuildManager } from '../managers/GuildManager';
import { UserManager } from '../managers/UserManager';
import type { Guild } from '../structures/Guild';
import type { Message } from '../structures/Message';
import { IntentsBitField } from '../utils/bitfield/IntentsBitField';
import { RestManager } from '../utils/rest/RestManager';
import { ActionManager } from './actions/ActionManager';
import { ClientOptions, defaultClientOptions, ParsedClientOptions } from './ClientOptions';
import * as Heartbeater from './websocket/Heartbeater';
import { WebsocketManager } from './websocket/WebsockerManager';

/** @private */
export interface ClientAPI {
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
  options: ParsedClientOptions;
  /** @private */
  api: ClientAPI;
  /** Whether the client has logged in */
  ready: boolean;
  /** Authorization token for the logged in bot */
  token: string;
  /** The previous heartbeat ping of the {@link Client} */
  ping: number;
  /** Stores caches of {@link Guild}s, {@link Role}s, Members, Channels and Messages */
  caches: CacheManager;
  /** Manages API methods for {@link Guild}s */
  guilds: GuildManager;
  /** Manages API methods for {@link Channel}s */
  channels: ChannelManager;
  /** Manages API methods for {@link User}s */
  users: UserManager;
  /** The Id of the logged client */
  id: string;
  rest: RestManager;
  /**
   * @param [options] - The options for the client
   * @example
   * ```js
   *  const client = new Client({ intents: ['Guilds'] })
   * ```
   */
  constructor(options = {} as Partial<ClientOptions>) {
    super();

    this.actions = new ActionManager();
    this.ws = new WebsocketManager(this);

    this.options = Object.assign(defaultClientOptions, options) as ParsedClientOptions;
    this.options.intents = this.options.intents instanceof IntentsBitField ? this.options.intents : new IntentsBitField(this.options.intents);

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
    this.id = '';
    this.ping = 0;
  }

  /** User that the client is logged in as */
  get user() {
    return this.users.me;
  }

  /**
   * Logs the client in, establishing a WebSocket connection to Discord
   * @param token - Token of the account to log in with
   * @example
   * ```js
   *  client.login('NzA8MDY1MDZxNjM3MTkzNzU5.XrR6-Q.IvHQd-6_XFNRfX4T7508QsyhaIc')
   * ```
   */
  login(token: string) {
    if (typeof token !== 'string') throw new Error('A token is required and must be a string');
    this.token = token;
    this.rest = new RestManager(this);
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
    Heartbeater.stop(this.api);

    this.cleanUp();
    this.emit(Events.Reconnecting);

    // If we don't have a session id, we cannot reconnect
    this.api.shouldResume = Boolean(this.api.sessionId);
    return this.login(this.token);
  }

  /** @private */
  cleanUp() {
    this.ping = 0;
    this.id = '';
    this.caches.destroy();
  }

  /** @private */
  #prepareCaches() {
    this.emit(Events.Debug, '[DEBUG] Creating cache properties');
    this.caches = new CacheManager(this, this.options.caches);
    this.guilds = new GuildManager(this);
    this.channels = new ChannelManager(this);
    this.users = new UserManager(this);
  }

  override on(event: string | symbol, listener: (...args: any[]) => void): this;
  /** Emitted when the client becomes ready to start working */
  override on(event: Events.Ready, listener: (client: Client) => any): this;
  /** Emitted for general debugging information */
  override on(event: Events.Debug, listener: (information: string) => any): this;
  /** Emitted whenever the client joins a guild */
  override on(event: Events.GuildCreate, listener: (guild: Guild) => any): this;
  /** Emitted whenever a guild kicks the client or the guild is deleted/left */
  override on(event: Events.GuildDelete, listener: (guild: Guild) => any): this;
  /** Emitted whenever a guild becomes unavailable, likely due to a server outage */
  override on(event: Events.GuildUnavailable, listener: (guild: Guild) => any): this;
  /** Emitted whenever the client needs to reconnect to the Discord API */
  override on(event: Events.Reconnecting, listener: () => any): this;
  /** Emitted whenever a guild is updated - e.g. name change */
  override on(event: Events.GuildUpdate, listener: (oldGuild: Guild | undefined, newGuild: Guild) => any): this;
  /**
   * Emitted whenever a message is created
   * @see https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Privileged-Intent-for-Verified-Bots
   */
  override on(event: Events.MessageCreate, listener: (message: Message) => any): this;

  /** Emitted when the client becomes ready to start working */
  override on(event: 'Ready', listener: (client: Client) => any): this;
  /** Emitted for general debugging information */
  override on(event: 'Debug', listener: (information: string) => any): this;
  /** Emitted whenever the client joins a guild */
  override on(event: 'GuildCreate', listener: (guild: Guild) => any): this;
  /** Emitted whenever a guild kicks the client or the guild is deleted/left */
  override on(event: 'GuildDelete', listener: (guild: Guild) => any): this;
  /** Emitted whenever a guild becomes unavailable, likely due to a server outage */
  override on(event: 'GuildUnavailable', listener: (guild: Guild) => any): this;
  /** Emitted whenever the client needs to reconnect to the Discord API */
  override on(event: 'Reconnecting', listener: () => any): this;
  /** Emitted whenever a guild is updated - e.g. name change */
  override on(event: 'GuildUpdate', listener: (oldGuild: Guild | undefined, newGuild: Guild) => any): this;
  /**
   * Emitted whenever a message is created
   * @see https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Privileged-Intent-for-Verified-Bots
   */
  override on(event: 'MessageCreate', listener: (message: Message) => any): this;
  override on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  override once(event: string | symbol, listener: (...args: any[]) => void): this;
  /** Emitted when the client becomes ready to start working */
  override once(event: Events.Ready, listener: (client: Client) => any): this;
  /** Emitted for general debugging information */
  override once(event: Events.Debug, listener: (information: string) => any): this;
  /** Emitted whenever the client joins a guild */
  override once(event: Events.GuildCreate, listener: (guild: Guild) => any): this;
  /** Emitted whenever a guild kicks the client or the guild is deleted/left */
  override once(event: Events.GuildDelete, listener: (guild: Guild) => any): this;
  /** Emitted whenever a guild becomes unavailable, likely due to a server outage */
  override once(event: Events.GuildUnavailable, listener: (guild: Guild) => any): this;
  /** Emitted whenever the client needs to reconnect to the Discord API */
  override once(event: Events.Reconnecting, listener: () => any): this;
  /** Emitted whenever a guild is updated - e.g. name change */
  override once(event: Events.GuildUpdate, listener: (oldGuild: Guild | undefined, newGuild: Guild) => any): this;
  /**
   * Emitted whenever a message is created
   * @see https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Privileged-Intent-for-Verified-Bots
   */
  override once(event: Events.MessageCreate, listener: (message: Message) => any): this;

  /** Emitted when the client becomes ready to start working */
  override once(event: 'Ready', listener: (client: Client) => any): this;
  /** Emitted for general debugging information */
  override once(event: 'Debug', listener: (information: string) => any): this;
  /** Emitted whenever the client joins a guild */
  override once(event: 'GuildCreate', listener: (guild: Guild) => any): this;
  /** Emitted whenever a guild kicks the client or the guild is deleted/left */
  override once(event: 'GuildDelete', listener: (guild: Guild) => any): this;
  /** Emitted whenever a guild becomes unavailable, likely due to a server outage */
  override once(event: 'GuildUnavailable', listener: (guild: Guild) => any): this;
  /** Emitted whenever the client needs to reconnect to the Discord API */
  override once(event: 'Reconnecting', listener: () => any): this;
  /** Emitted whenever a guild is updated - e.g. name change */
  override once(event: 'GuildUpdate', listener: (oldGuild: Guild | undefined, newGuild: Guild) => any): this;
  /**
   * Emitted whenever a message is created
   * @see https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Privileged-Intent-for-Verified-Bots
   */
  override once(event: 'MessageCreate', listener: (message: Message) => any): this;
  override once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }
}

export { Client };
