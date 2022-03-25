import { RouteBases, GatewayVersion } from 'discord-api-types/v10';
import type { IntentsCheckType, IntentsBitField } from '../utils/bitfield/IntentsBitField';

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
}

export interface ParsedClientOptions extends ClientOptions {
  /** {@link IntentsBitField} to enable for this connection */
  intents: IntentsBitField;
}

/** Caching options for {@link ClientOptions.caches} */
export interface ClientCacheOptions {
  /** @defaultValue `Infinity` */
  guilds: number;
  /** @defaultValue `Infinity` */
  roles: number;
  /** @defaultValue `Infinity` */
  members: number;
  /** @defaultValue `Infinity` */
  channels: number;
  /** @defaultValue `Infinity` */
  users: number;
  /** @defaultValue `200` */
  messages: number;
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
  },
  intents: 0,
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
