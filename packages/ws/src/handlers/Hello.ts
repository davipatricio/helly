import type { GatewayHelloData } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';
import { sendIdentify } from './Identify';
import { sendResume } from './Resume';

export function handleHello(client: WebSocketClient, data: GatewayHelloData) {
  client.data.heartbeatInterval = data.heartbeat_interval;

  client.emit('debug', 'Handling hello request from Discord.');
  if (client.data.sessionId && client.data.sequence && client.options.token) {
    client.emit('debug', 'WebSocketClient has a session ID and sequence, attempting to resume.');
    sendResume(client, { seq: client.data.sequence, session_id: client.data.sessionId, token: client.options.token });
    return;
  }

  client.emit('debug', 'Attempting to start a new session.');
  sendIdentify(client, client.options);
}
