import type { APIMessage, GatewayMessageDeleteDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import { Message } from '../../structures/Message';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayMessageDeleteDispatchData) {
  const message = client.caches.messages.get(data.id) ?? new Message(client, data as APIMessage);
  if (client.ready) client.emit(Events.MessageDelete, message);

  client.caches.messages.delete(data.id);
}

export { handle };
