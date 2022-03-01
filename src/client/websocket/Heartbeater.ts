import { GatewayHeartbeat, GatewayOpcodes } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Client, ClientAPI } from '../Client';

function start(client: Client) {
  // We don't want a lot of intervals sending heartbeats, so we use a single interval to do this task
  if (client.api.heartbeatTimer || !client.api.heartbeatInterval) return;

  client.api.heartbeatTimer = setInterval(() => {
    // If Discord didn't respond to our last heartbeat, we shouldn't send more heartbeats
    // The library itself will handle the reconnection
    if (!client.api.heartbeatAcked) return;

    const heartbeatData: GatewayHeartbeat = {
      op: GatewayOpcodes.Heartbeat,
      d: client.api.sequence,
    };

    client.api.lastHeartbeat = Date.now();
    client.api.heartbeatAcked = false;

    client.ws.connection?.send(JSON.stringify(heartbeatData));
    client.emit(Events.Debug, '[DEBUG] Sent heartbeat to Discord.');

    // The client should receive an ACK in less than 15 seconds
    // If not, the client should disconnect and reconnect and send a 'Resume' command
    setTimeout(() => {
      if (!client.api.heartbeatAcked) {
        client.emit(Events.Debug, "[DEBUG] Heartbeat wasn't acked in 15 seconds. Reconnecting...");

        // Close the connection with a non-1000 code so we can reconnect with the stored session id
        client.ws.connection?.close(4_999);
      }
    }, 15_000).unref();
  }, client.api.heartbeatInterval).unref();
}

function stop(api: ClientAPI) {
  if (api.heartbeatTimer) clearInterval(api.heartbeatTimer);
  api.heartbeatTimer ??= null;
}

function sendImmediately(client: Client) {
  const heartbeatData: GatewayHeartbeat = {
    op: GatewayOpcodes.Heartbeat,
    d: client.api.sequence,
  };

  client.ws.connection?.send(JSON.stringify(heartbeatData));
  client.emit(Events.Debug, '[DEBUG] Sent heartbeat to Discord.');
}

export { start, stop, sendImmediately };
