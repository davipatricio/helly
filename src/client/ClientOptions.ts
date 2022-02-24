import { RouteBases, GatewayVersion } from 'discord-api-types/v10';
import type { IntentParser, Intents } from '../utils/Intents';

/** Options for a {@link Client} */
export interface ClientOptions {
  /**
   * Whether the client should automatically reconnect if it loses its connection
   * @defaultValue `true`
   */
  autoReconnect: boolean;
  /** Default value for {@link APIMessageReferenceSend.fail_if_not_exists} */
  failIfNotExists: boolean;
  /** Limit caching of specific structures */
  caches: ClientCacheOptions;
  /** {@link Intents} to enable for this connection */
  intents: Intents | IntentParser;
  /** Options for the REST Manager */
  rest: RestOptions;
  /** Options for the WebSocket */
  ws: WebSocketOptions;
}

export interface ParsedClientOptions extends ClientOptions {
  /** {@link Intents} to enable for this connection */
  intents: Intents;
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
  messages: number;
}

/** Options for the {@link ClientOptions.rest | REST Manager} */
export interface RestOptions {
  /** @defaultValue `https://discord.com/api/v10` */
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
    messages: Infinity,
  },
  intents: 0,
  rest: {
    api: RouteBases.api,
    cdn: RouteBases.cdn,
    invite: RouteBases.invite,
    template: RouteBases.template,
    gift: RouteBases.gift,
    scheduledEvent: RouteBases.scheduledEvent,
  },
  ws: {
    gateway: 'wss://gateway.discord.gg/',
    version: GatewayVersion,
    largeThreshold: 50,
  },
};
