import { setTimeout as sleep } from 'timers/promises';

import { GatewayOpcodes } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendHeartbeat(client: WebSocketClient) {
  client.data.lastHeartbeatAck = false;

  client.emit('Debug', 'Sending heartbeat to Discord.');
  client.send({ d: client.data.sequence, op: GatewayOpcodes.Heartbeat });

  handlePossibleDisconnection(client);
}

export function handleHeartbeat(client: WebSocketClient) {
  sendHeartbeat(client);
}

export function startHeartbeatInterval(client: WebSocketClient) {
  if (client.data.heartbeater) return;

  client.data.heartbeater = setInterval(() => sendHeartbeat(client), client.data.heartbeatInterval);
}

export function stopHeartbeatInterval(client: WebSocketClient) {
  if (!client.data.heartbeater) return;
  client.emit('Debug', 'Stopped sending heartbeats to Discord.');

  clearInterval(client.data.heartbeater);
  client.data.heartbeater = null;
}

async function handlePossibleDisconnection(client: WebSocketClient) {
  await sleep(10000);

  if (client.data.lastHeartbeatAck) return;
  stopHeartbeatInterval(client);

  client.emit('Debug', 'Discord did not send a Heartbeat ACK in 10 seconds, waiting 5 more seconds.');

  await sleep(5000);
  if (client.data.lastHeartbeatAck) {
    client.emit('Debug', 'Discord sent a Heartbeat ACK, resuming heartbeat.');
    startHeartbeatInterval(client);
    return;
  }

  client.emit('Debug', 'Discord did not send a Heartbeat ACK in 15 seconds. Attempting to reconnect.');
  // TODO: Reconnect
}
