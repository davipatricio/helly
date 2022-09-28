import { GatewayIdentify, GatewayIdentifyData, GatewayOpcodes } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendIdentify(client: WebSocketClient, d: GatewayIdentifyData) {
  client.manager?.send(JSON.stringify({ d, op: GatewayOpcodes.Identify } as GatewayIdentify));
}
