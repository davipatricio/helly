import { GatewayOpcodes, GatewayPresenceUpdateData } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendPresenceUpdate(client: WebSocketClient, data: GatewayPresenceUpdateData) {
  client.send({
    d: data,
    op: GatewayOpcodes.PresenceUpdate,
  });
}
