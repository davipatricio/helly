import type { WebSocketClient } from '../client/WebSocketClient';

export function handleHeartbeatAck(client: WebSocketClient) {
  client.data.lastHeartbeatAck = true;
  client.data.lastHeartbeatTime = Date.now();
}
