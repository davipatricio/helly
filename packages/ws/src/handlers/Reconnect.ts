import type { WebSocketClient } from '../client/WebSocketClient';

export function handleReconnect(client: WebSocketClient) {
  return { client };
}
