import type { APIGuildChannel, ChannelType, GatewayChannelCreateDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayChannelCreateDispatchData) {
  const channel = client.channels.updateOrSet(data.id, data as APIGuildChannel<ChannelType>);
  if (client.ready) client.emit(Events.ChannelCreate, channel);
}

export { handle };
