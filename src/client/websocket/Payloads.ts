import { GatewayIdentify, GatewayOpcodes, GatewayResume } from 'discord-api-types/v10';
import type { Client } from '../Client';

function sendIdentify(client: Client) {
  const data: GatewayIdentify = {
    op: GatewayOpcodes.Identify,
    d: {
      token: client.token,
      intents: 0,
      compress: false,
      large_threshold: 50,
      properties: {
        $browser: 'helly',
        $device: 'helly',
        $os: process.platform,
      },
    },
  };

  client.ws.connection?.send(JSON.stringify(data));
}

function sendResume(client: Client): void {
  const ResumePayload: GatewayResume = {
    op: GatewayOpcodes.Resume,
    d: {
      token: client.token,
      session_id: client.api.sessionId,
      seq: client.api.sequence,
    },
  };

  client.ws.connection?.send(JSON.stringify(ResumePayload));
}

export { sendIdentify, sendResume };
