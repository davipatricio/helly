import type { GatewayRequestGuildMembersData } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendRequestGuildMembers(client: WebSocketClient, data: GatewayRequestGuildMembersData) {
  return { client, data };
}
