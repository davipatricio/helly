import { RouteBases, GatewayVersion } from 'discord-api-types/v10';

/**
 * Websocket Options for {@link ClientOptions.ws}
 */
export interface WebsocketOptions {
  /** @defaultValue `wss://gateway.discord.gg/` */
  gateway: string;
  /** @defaultValue `10` */
  version: string;
}

/**
 * REST Options for {@link ClientOptions.rest}
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
   * @defaultValue true
   */
  autoReconnect: boolean;
  /** REST Options */
  rest: RestOptions;
  /** Websocket Options */
  ws: WebsocketOptions;
}

export const defaultValues: ClientOptions = {
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
