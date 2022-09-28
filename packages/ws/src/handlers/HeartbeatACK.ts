import type { WebSocketClient } from '../client/WebSocketClient';

export function handleHeartbeatAck(client: WebSocketClient) {
  client.data.lastHeartbeatAck = true;
  client.data.lastHeartbeatTime = Date.now();
  client.emit('debug', `Heartbeat acknowledged. Sending next in ${client.data.heartbeatInterval}ms.`);
}
