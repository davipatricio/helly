import { GatewayOpcodes, GatewayRequestGuildMembersData } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendRequestGuildMembers(client: WebSocketClient, data: GatewayRequestGuildMembersData) {
  client.send({
    d: data,
    op: GatewayOpcodes.RequestGuildMembers,
  });
}
