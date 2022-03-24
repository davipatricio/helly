import type { GatewayMessageCreateDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import { Message } from '../../structures/Message';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayMessageCreateDispatchData) {
  const message = new Message(client, data);
  if (client.ready) client.emit(Events.MessageCreate, message);
}

export { handle };
