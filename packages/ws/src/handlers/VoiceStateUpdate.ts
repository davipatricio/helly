import { GatewayOpcodes, GatewayVoiceStateUpdateData } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendVoiceStateUpdate(client: WebSocketClient, data: GatewayVoiceStateUpdateData) {
  client.send({
    d: data,
    op: GatewayOpcodes.VoiceStateUpdate,
  });
}
