import type { GatewayVoiceStateUpdateData } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendVoiceStateUpdate(client: WebSocketClient, data: GatewayVoiceStateUpdateData) {
  return { client, data };
}
