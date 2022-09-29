import { GatewayVersion, RouteBases } from 'discord-api-types/v10';
import { GatewayURL } from '../constants';
import type { IntentsResolvable } from '../utils';

/**
 * Options for a {@link Client}
 */
export interface ClientOptions {
  /**
   * Whether the client should automatically reconnect if it loses its connection
   * @defaultValue `true`
   */
  autoReconnect: boolean;
  /**
   * Limit caching of specific structures
   */
  cache: Partial<ClientCacheOptions>;
  /**
   * Intents to enable for this connection
   */
  intents: IntentsResolvable;
  /**
   * Options for the REST Manager
   */
  rest: Partial<RestOptions>;
  /**
   * Token of the account to log in with
   */
  token: string;
  /**
   * Time in milliseconds that Clients with the GUILDS intent should wait for missing guilds to be received before starting the bot. If not specified, the default is 15 seconds
   * @defaultValue `15_000`
   */
  waitGuildTimeout: number;
  /**
   * Options for the WebSocket
   */
  ws: Partial<WebSocketOptions>;
}
/**
 * Caching options for {@link ClientOptions.caches}
 */
export interface ClientCacheOptions {
  /**
   * Maximum amount of bans to cache - per guild
   * @defaultValue `100`
   */
  bans: number;
  /**
   * Maximum amount of channels to cache
   * @defaultValue `Infinity`
   */
  channels: number;
  /**
   * Maximum amount of global commands to cache
   * @defaultValue `100`
   */
  commands: number;
  /**
   * Maximum amount of commands to cache - per guild
   * @defaultValue `100`
   */
  guildCommands: number;
  /**
   * Maximum amount of guilds to cache
   * @defaultValue `Infinity`
   */
  guilds: number;
  /**
   * Maximum amount of members to cache - per guild
   * @defaultValue `Infinity`
   */
  members: number;
  /**
   * Maximum amount of messages to cache - per channel
   * @defaultValue `100`
   */
  messages: number;
  /**
   * Maximum amount of roles to cache
   * @defaultValue `Infinity`
   */
  roles: number;
  /**
   * Maximum amount of users to cache
   * @defaultValue `Infinity`
   */
  users: number;
}

/** Options for the {@link ClientOptions.rest | REST Manager} */
export interface RestOptions {
  /**
   * @defaultValue `https://discord.com/api`
   */
  api: string;
  /**
   * @defaultValue `https://cdn.discordapp.com`
   */
  cdn: string;
  /**
   * @defaultValue `https://discord.gift`
   */
  gift: string;
  /**
   * @defaultValue `https://discord.gg`
   */
  invite: string;
  /**
   * @defaultValue `https://discord.com/events`
   */
  scheduledEvent: string;
  /**
   * @defaultValue `https://discord.new`
   */
  template: string;
}

/**
 * Options for the {@link ClientOptions.ws | WebSocket}
 */
export interface WebSocketOptions {
  /** @defaultValue `wss://gateway.discord.gg/` */
  gateway: string;
  /** @defaultValue `50` */
  largeThreshold: number;
  /** @defaultValue `10` */
  version: string;
}

export const defaultClientOptions: ClientOptions = {
  autoReconnect: true,
  cache: {
    bans: 100,
    channels: Infinity,
    commands: 100,
    guildCommands: 100,
    guilds: Infinity,
    members: Infinity,
    messages: 100,
    roles: Infinity,
    users: Infinity,
  },
  intents: [],
  rest: {
    api: RouteBases.api,
    cdn: RouteBases.cdn,
    gift: RouteBases.gift,
    invite: RouteBases.invite,
    scheduledEvent: RouteBases.scheduledEvent,
    template: RouteBases.template,
  },
  token: process.env.DISCORD_TOKEN ?? process.env.BOT_TOKEN ?? '',
  waitGuildTimeout: 15_000,
  ws: {
    gateway: GatewayURL,
    largeThreshold: 50,
    version: GatewayVersion,
  },
};
