import { RouteBases, GatewayVersion } from 'discord-api-types/v10';

export interface WebsocketOptions {
  gateway: string;
  version: string;
}

export interface ClientOptions {
  autoReconnect: boolean;
  rest: typeof RouteBases;
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
