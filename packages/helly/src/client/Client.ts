import { WebSocketClient } from '@hellyjs/ws';
import EventEmitter from 'events';
import type { ChannelManager, GuildManager, UserManager } from '../managers';
import type { CacheManager } from '../managers/CacheManager';
import { IntentsBitField } from '../utils';
import type { Awaitable } from '../utils/types';
import { ActionManager } from './actions';
import type { ClientEvents } from './ClientEvents';
import { ClientOptions, defaultClientOptions } from './ClientOptions';

/**
 * A object representing the client options after they have been resolved
 */
export interface ParsedClientOptions extends ClientOptions {
  intents: IntentsBitField;
}

export class Client extends EventEmitter {
  /**
   * @private @internal
   */
  actions: ActionManager;
  /**
   * A class that handles all the caching
   */
  cache: CacheManager;
  /**
   * A manager of channels belonging to a client
   */
  channels: ChannelManager;
  /**
   * A manager of guilds belonging to a client
   */
  guilds: GuildManager;
  /**
   * The id of the logged client
   */
  id: string;
  /**
   * The options the client was instantiated with
   */
  readonly options: ParsedClientOptions;
  /**
   * Whether the client is ready
   */
  ready: boolean;
  /**
   * A manager of users belonging to a client
   */
  users: UserManager;
  /**
   * A {@link WebSocketClient} instance
   */
  ws: WebSocketClient;
  /**
   * @param options The options for the client
   * @example
   * ```js
   *  const { Client, GatewayIntentBits } = require('helly');
   *  const client = new Client({ token: '', intents: [GatewayIntentBits.Guilds] })
   * ```
   */
  constructor(options: Partial<ClientOptions> = {}) {
    super();

    this.id = '';
    this.ready = false;
    Object.defineProperty(this, 'options', { configurable: false, value: this.#parseOptions({ ...defaultClientOptions, ...options }), writable: false });

    this.ws = new WebSocketClient({
      compress: this.options.ws.compress,
      intents: Number(this.options.intents.bitfield),
      token: this.options.token,
    });
    this.actions = new ActionManager(this);
  }

  connect() {
    this.ws.connect();
  }

  override emit<K extends keyof ClientEvents>(event: K, ...args: unknown[]): boolean;
  override emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: unknown[]): boolean;
  override emit(event: string | symbol, ...args: unknown[]) {
    return super.emit(event, ...args);
  }

  override off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>);
  override off<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: unknown[]) => Awaitable<void>);
  override off(event: string | symbol, listener: (...args: unknown[]) => void) {
    return super.off(event, listener);
  }

  override on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>);
  override on<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: unknown[]) => Awaitable<void>);
  override on(event: string | symbol, listener: (...args: unknown[]) => void) {
    return super.on(event, listener);
  }

  override once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>);
  override once<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, listener: (...args: unknown[]) => Awaitable<void>);
  override once(event: string | symbol, listener: (...args: unknown[]) => void) {
    return super.once(event, listener);
  }

  #parseOptions(options: ClientOptions): ParsedClientOptions {
    const parsedOptions = options as ParsedClientOptions;
    if (options.intents) parsedOptions.intents = new IntentsBitField(options.intents);

    return parsedOptions;
  }

  override removeAllListeners<K extends keyof ClientEvents>(event?: K);
  override removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>);
  override removeAllListeners(event: string | symbol) {
    return super.removeAllListeners<string | symbol>(event);
  }
}
