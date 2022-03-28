import type { GatewayMessageCreateDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayMessageCreateDispatchData) {
  const message = client.messages.updateOrSet(data.id, data);
  if (client.ready) client.emit(Events.MessageCreate, message);

  client.messages.updateOrSet(message.id, data);
}

export { handle };
