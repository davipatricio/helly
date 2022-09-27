import type { GatewayHelloData } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';
import { sendIdentify } from './Identify';
import { sendResume } from './Resume';

export function handleHello(client: WebSocketClient, data: GatewayHelloData) {
  client.data.heartbeatInterval = data.heartbeat_interval;

  if (client.data.sessionId && client.data.sequence && client.options.token) {
    sendResume(client, { seq: client.data.sequence, session_id: client.data.sessionId, token: client.options.token });
    return;
  }

  sendIdentify(client, client.options);
}
