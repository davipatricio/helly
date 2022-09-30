import type { GatewayInvalidSession } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function handleInvalidSession(client: WebSocketClient, data: GatewayInvalidSession) {
  client.emit('Debug', 'Session is invalid. Attempting to reconnect.');

  // If the 'd' field is set to true, we should resume the session
  if (data.d && client.data.sessionId && client.data.sequence && client.options.token) {
    client.socket?.close(4000);
  } else {
    client.data.sessionId = null;
    client.data.sequence = null;
    client.socket?.close(1000);
  }
  client.connect();
}
