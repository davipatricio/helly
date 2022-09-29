import type { GatewayDispatchPayload } from 'discord-api-types/v10';
import type { WebSocketClient } from '../client/WebSocketClient';

export function handleDispatch(client: WebSocketClient, data: GatewayDispatchPayload) {
  client.emit('Dispatch', data);

  // Store the sequence number
  client.data.sequence = data.s;

  // Cache the resume gateway url
  if (data.t === 'READY') {
    client.data.resumeGatewayUrl = data.d.resume_gateway_url;
  }
}
