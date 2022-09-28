import { GatewayIdentify, GatewayIdentifyData, GatewayOpcodes } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendIdentify(client: WebSocketClient, d: GatewayIdentifyData) {
  client.emit('debug', 'Sending identify payload to Discord.');
  client.manager?.send(JSON.stringify({ d, op: GatewayOpcodes.Identify } as GatewayIdentify));
}
