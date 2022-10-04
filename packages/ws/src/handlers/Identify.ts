import { GatewayIdentifyData, GatewayOpcodes } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function sendIdentify(client: WebSocketClient, d: GatewayIdentifyData) {
  client.emit('Debug', 'Sending identify payload to Discord.');
  client.send({ d, op: GatewayOpcodes.Identify });
}
