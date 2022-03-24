import type { GatewayGuildUpdateDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayGuildUpdateDispatchData) {
  const oldGuild = client.caches.guilds.get(data.id);
  const newGuild = client.guilds.updateOrSet(data.id, data);
  if (client.ready) client.emit(Events.GuildUpdate, oldGuild, newGuild);
}

export { handle };
