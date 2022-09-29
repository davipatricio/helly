import { GatewayOpcodes } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendHeartbeat(client: WebSocketClient) {
  client.emit('Debug', 'Sending heartbeat to Discord.');
  client.send({ d: client.data.sequence, op: GatewayOpcodes.Heartbeat });
}

export function handleHeartbeat(client: WebSocketClient) {
  sendHeartbeat(client);
}

export function startHeartbeatInterval(client: WebSocketClient) {
  if (client.data.heartbeater) return;

  client.data.heartbeater = setInterval(() => {
    client.data.lastHeartbeatAck = false;
    sendHeartbeat(client);
  }, client.data.heartbeatInterval);
}

export function stopHeartbeatInterval(client: WebSocketClient) {
  if (!client.data.heartbeater) return;
  client.emit('Debug', 'Stopped sending heartbeats to Discord.');

  clearInterval(client.data.heartbeater);
  client.data.heartbeater = null;
}
