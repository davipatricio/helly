import { RouteBases, GatewayVersion } from 'discord-api-types/v10';

/**
 * Options for the {@link ClientOptions.ws | WebSocket}
 */
export interface WebSocketOptions {
  /** @defaultValue `wss://gateway.discord.gg/` */
  gateway: string;
  /** @defaultValue `10` */
  version: string;
}

/**
 * Options for the {@link ClientOptions.rest | REST Manager}
 */
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

/**
 * Options for a {@link Client}
 */
export interface ClientOptions {
  /**
   * Whether the client should automatically reconnect if it loses its connection
   * @defaultValue `true`
   */
  autoReconnect: boolean;
  /** Options for the REST Manager */
  rest: RestOptions;
  /** Options for the WebSocket */
  ws: WebSocketOptions;
}

export const defaultClientOptions: ClientOptions = {
  autoReconnect: true,
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
  },
};
