import type { GatewayReadyDispatchData } from 'discord-api-types/v10';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayReadyDispatchData) {
  client.api.sessionId = data.session_id;
  setTimeout(() => {
    client.emit('ready');
  }, 3500);
}

export { handle };
