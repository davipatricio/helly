import { GatewayHelloData, GatewayOpcodes, GatewayReceivePayload } from 'discord-api-types/v10';
import type { RawData } from 'ws';
import type { Client } from '../Client';
import * as Heartbeater from './Heartbeater';
import * as Payloads from './Payloads';

function message(client: Client, rawData: RawData): void {
  const parsedData: GatewayReceivePayload = JSON.parse(rawData as unknown as string);

  const opcode = parsedData.op;
  const eventData = parsedData.d;
  const sequence = parsedData.s;

  // If the client is reconnecting/resuming, we don't want to override the last sequence number
  if (!client.api.shouldResume && opcode === GatewayOpcodes.Dispatch) client.api.sequence = sequence ?? null;

  switch (opcode) {
    case GatewayOpcodes.InvalidSession: {
      if (client.api.shouldResume) return;
      client.ws.connection?.close(4_000);
      Heartbeater.stop(client);
      client.reconnect();
      break;
    }

    case GatewayOpcodes.Hello: {
      const data = eventData as GatewayHelloData;

      // Here we should resume the session if we have a pending resume request
      if (client.api.shouldResume) {
        Payloads.sendResume(client);

        client.api.shouldResume = false;
        client.api.heartbeatInterval = data.heartbeat_interval;

        client.emit('debug', `[DEBUG] Defined Heartbeater to ${data.heartbeat_interval}ms. Starting to Heartbeat.`);

        // Because we're starting to Heartbeat, we need to say that the last Heartbeater was acked.
        client.api.heartbeatAcked = true;
        client.ready = true;

        Heartbeater.start(client);
        Heartbeater.sendImmediately(client);
        return;
      }
      client.emit('debug', `[DEBUG] Defined Heartbeater to ${data.heartbeat_interval}ms. Starting to Heartbeat.`);

      client.api.heartbeatInterval = data.heartbeat_interval;

      // Because we're starting to Heartbeat, we need to say that the last Heartbeater was acked.
      client.api.heartbeatAcked = true;

      Heartbeater.start(client);
      Payloads.sendIdentify(client);
      break;
    }

    // Gateway Heartbeater ACK
    case GatewayOpcodes.HeartbeatAck: {
      client.emit('debug', '[DEBUG] Received Heartbeat ACK.');
      client.api.lastHeartbeatAck = Date.now();

      // Mark that we've received the Heartbeater ACK so we can send more heartbeats.
      client.api.heartbeatAcked = true;
      client.ping = client.api.lastHeartbeatAck - client.api.lastHeartbeat;
      break;
    }
  }
}

export { message };
