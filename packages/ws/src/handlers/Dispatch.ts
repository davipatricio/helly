import type { GatewayDispatchPayload } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function handleDispatch(client: WebSocketClient, data: GatewayDispatchPayload) {
  return { client, data };
}
