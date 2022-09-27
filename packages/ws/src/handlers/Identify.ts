import { GatewayIdentify, GatewayIdentifyData, GatewayOpcodes } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendIdentify(client: WebSocketClient, data: GatewayIdentifyData) {
  client.ws?.send(JSON.stringify({ d: data, op: GatewayOpcodes.Identify } as GatewayIdentify));
}
