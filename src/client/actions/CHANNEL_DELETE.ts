import type { APIGuildChannel, ChannelType, GatewayChannelDeleteDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayChannelDeleteDispatchData) {
  const channel = client.channels.updateOrSet(data.id, data as APIGuildChannel<ChannelType>);
  if (client.ready) client.emit(Events.ChannelDelete, channel);

  client.caches.channels.delete(data.id);
}

export { handle };
