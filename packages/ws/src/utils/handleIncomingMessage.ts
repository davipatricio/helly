import { GatewayOpcodes, GatewayReceivePayload } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';
import { handleDispatch } from '../handlers/Dispatch';
import { handleHeartbeat } from '../handlers/Heartbeat';
import { handleHeartbeatAck } from '../handlers/HeartbeatACK';
import { handleHello } from '../handlers/Hello';
import { handleInvalidSession } from '../handlers/InvalidSession';
import { handleReconnect } from '../handlers/Reconnect';

export function handleIncomingMessage(client: WebSocketClient, data: GatewayReceivePayload) {
  switch (data.op) {
    case GatewayOpcodes.Dispatch:
      handleDispatch(client, data);
      break;
    case GatewayOpcodes.Heartbeat:
      handleHeartbeat(client);
      break;
    case GatewayOpcodes.HeartbeatAck:
      handleHeartbeatAck(client);
      break;
    case GatewayOpcodes.Hello:
      handleHello(client, data.d);
      break;
    case GatewayOpcodes.InvalidSession:
      handleInvalidSession(client, data);
      break;
    case GatewayOpcodes.Reconnect:
      handleReconnect(client);
      break;
  }
}
