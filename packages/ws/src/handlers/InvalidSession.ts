import type { GatewayInvalidSessionData } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function handleInvalidSession(client: WebSocketClient, data: GatewayInvalidSessionData) {
  return { client, data };
}
