import { GatewayVersion, RouteBases } from 'discord-api-types/v10';
import type { IntentsBitField, IntentsCheckType } from '../utils/bitfield/IntentsBitField';

/** Options for a {@link Client} */
export interface ClientOptions {
  /**
   * Whether the client should automatically reconnect if it loses its connection
   * @defaultValue `true`
   */
  autoReconnect: boolean;
  /** Default value for {@link MessageReferenceSend.failIfNotExists} */
  failIfNotExists: boolean;
  /** Limit caching of specific structures */
  caches: ClientCacheOptions;
  /** {@link IntentsBitField} to enable for this connection */
  intents: IntentsBitField | IntentsCheckType;
  /** Options for the REST Manager */
  rest: RestOptions;
  /** Options for the WebSocket */
  ws: WebSocketOptions;
  /**
   * Time in milliseconds that Clients with the GUILDS intent should wait for missing guilds to be received before starting the bot. If not specified, the default is 15 seconds
   * @defaultValue `15_000`
   */
  waitGuildTimeout: number;
}

export interface ParsedClientOptions extends ClientOptions {
  /** {@link IntentsBitField} to enable for this connection */
  intents: IntentsBitField;
}

/** Caching options for {@link ClientOptions.caches} */
export interface ClientCacheOptions {
  /**
   * Maximum amount of guilds to cache
   * @defaultValue `Infinity`
   */
  guilds: number;
  /**
   * Maximum amount of roles to cache
   * @defaultValue `Infinity`
   */
  roles: number;
  /**
   * Maximum amount of members to cache - per guild
   * @defaultValue `Infinity`
   */
  members: number;
  /**
   * Maximum amount of channels to cache
   * @defaultValue `Infinity`
   */
  channels: number;
  /**
   * Maximum amount of users to cache
   * @defaultValue `Infinity`
   */
  users: number;
  /**
   * Maximum amount of messages to cache - per channel
   * @defaultValue `200`
   */
  messages: number;
  /**
   * Maximum amount of bans to cache - per guild
   * @defaultValue `100`
   */
  bans: number;
  /**
   * Maximum amount of commands to cache - per guild
   * @defaultValue `100`
   */
  guildCommands: number;
  /**
   * Maximum amount of global commands to cache
   * @defaultValue `100`
   */
  commands: number;
}

/** Options for the {@link ClientOptions.rest | REST Manager} */
export interface RestOptions {
  /** @defaultValue `https://discord.com/api` */
  api: string;
  /** @defaultValue `https://cdn.discordapp.com` */
  cdn: string;
  /** @defaultValue `https://discord.gg` */
  invite: string;
  /** @defaultValue `https://discord.new` */
  template: string;
  /** @defaultValue `https://discord.gift` */
  gift: string;
  /** @defaultValue `https://discord.com/events` */
  scheduledEvent: string;
  /**
   * Default value for {@link ImageURLOptions.forceStatic}
   * @defaultValue `false`
   */
  forceStatic: boolean;
  /** How many requests to allow sending per second (`Infinity` for unlimited, 50 for the standard global limit used by Discord) */
  globalRequestsPerSecond: number;
  /** The number of retries for errors with the 500 code, or errors that timeout */
  retries: number;
}

/** Options for the {@link ClientOptions.ws | WebSocket} */
export interface WebSocketOptions {
  /** @defaultValue `wss://gateway.discord.gg/` */
  gateway: string;
  /** @defaultValue `10` */
  version: string;
  /** @defaultValue `50` */
  largeThreshold: number;
}

export const defaultClientOptions: ClientOptions = {
  autoReconnect: true,
  failIfNotExists: true,
  caches: {
    guilds: Infinity,
    roles: Infinity,
    members: Infinity,
    channels: Infinity,
    users: Infinity,
    messages: 200,
    bans: 100,
    guildCommands: 100,
    commands: 100,
  },
  intents: 0,
  waitGuildTimeout: 15_000,
  rest: {
    api: 'https://discord.com/api',
    cdn: RouteBases.cdn,
    invite: RouteBases.invite,
    template: RouteBases.template,
    gift: RouteBases.gift,
    scheduledEvent: RouteBases.scheduledEvent,
    forceStatic: false,
    globalRequestsPerSecond: 50,
    retries: 1,
  },
  ws: {
    gateway: 'wss://gateway.discord.gg/',
    version: GatewayVersion,
    largeThreshold: 50,
  },
};
