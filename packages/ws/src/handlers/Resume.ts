import type { GatewayResumeData } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendResume(client: WebSocketClient, data: GatewayResumeData) {
  return { client, data };
}
