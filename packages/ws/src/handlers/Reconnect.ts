import type { WebSocketClient } from '../client/WebSocketClient';

export function handleReconnect(client: WebSocketClient) {
  client.emit('Debug', 'Received a reconnect request from Discord. Attempting to resume.');

  client.socket?.close(4000);
  client.connect();
}
