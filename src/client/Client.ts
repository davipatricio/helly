import { APIWebhook, Routes } from 'discord-api-types/v10';
import EventEmitter from 'node:events';
import { Events } from '../constants/Events';
import { ApplicationCommandManager } from '../managers';
import { CacheManager } from '../managers/CacheManager';
import { ChannelManager } from '../managers/ChannelManager';
import { GuildManager } from '../managers/GuildManager';
import { MessageManager } from '../managers/MessageManager';
import { UserManager } from '../managers/UserManager';
import { Webhook } from '../structures/Webhook';
import { IntentsBitField } from '../utils/bitfield/IntentsBitField';
import { RestManager } from '../utils/rest/RestManager';
import { ActionManager } from './actions/ActionManager';
import type { ClientEvents } from './ClientEvents';
import { ClientOptions, defaultClientOptions, ParsedClientOptions } from './ClientOptions';
import * as Heartbeater from './websocket/Heartbeater';
import { WebsocketManager } from './websocket/WebsocketManager';

type Awaitable<T> = T | PromiseLike<T>;

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
  // TODO: move to application when ClientApplication is implemented
  /** Manages API methods for {@link ApplicationCommand}s */
  commands: ApplicationCommandManager;
  /** Manages API methods for {@link User}s */
  users: UserManager;
  /** Manages API methods for {@link Message}s */
  messages: MessageManager;
  /** The Id of the logged client */
  id: string;
  /* The manager that handles requests to the Discord API */
  rest: RestManager;
  /**
   * @param options The options for the client
   * @example
   * ```js
   *  const { Client, GatewayIntentBits } = require('helly');
   *  const client = new Client({ intents: [GatewayIntentBits.Guilds] })
   * ```
   */
  constructor(options: Partial<ClientOptions> = {}) {
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

  /** Returns whether the client has logged in, indicative of being able to access properties such as user and application */
  isReady() {
    return this.ready === true;
  }

  /**
   * Logs the client in, establishing a WebSocket connection to Discord
   * @param token Token of the account to log in with
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

  /**
   * Obtains a webhook from Discord
   * @param id The Id of the webhook
   * @param token The token of the webhook
   */
  async fetchWebhook(id: string, token?: string) {
    const data = (await this.rest.make(Routes.webhook(id), 'Get')) as APIWebhook;
    return new Webhook(this, { token, ...data });
  }

  /** Emits `Client#Reconnecting` and calls `Client.login()` again */
  reconnect() {
    // Stop heartbeating (this automatically verifies if there's a timer)
    Heartbeater.stop(this.api);

    this.cleanUp();
    this.emit(Events.Reconnecting);

    // If we don't have a sessionId, we cannot reconnect
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
    this.messages = new MessageManager(this);
    this.commands = new ApplicationCommandManager(this);
  }

  /** @private */
  incrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) this.setMaxListeners(maxListeners + 1);
  }

  /** @private */
  decrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) this.setMaxListeners(maxListeners - 1);
  }

  override on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
  override on<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaitable<void>): this;
  override on(event: string | symbol, listener: (...args: any[]) => void) {
    return super.on(event, listener);
  }

  override once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
  override once<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaitable<void>): this;
  override once(event: string | symbol, listener: (...args: any[]) => void) {
    return super.once(event, listener);
  }

  override emit<K extends keyof ClientEvents>(event: K, ...args: any[]): boolean;
  override emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: any[]): boolean;
  override emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  override off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
  override off<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: any[]) => Awaitable<void>): this;
  override off(event: string | symbol, listener: (...args: any[]) => void) {
    return super.off(event, listener);
  }

  override removeAllListeners<K extends keyof ClientEvents>(event?: K): this;
  override removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>): this;
  override removeAllListeners(event: string | symbol) {
    return super.removeAllListeners(event);
  }
}

export { Client };
