import type { GatewayGuildCreateDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Guild } from '../../structures/Guild';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayGuildCreateDispatchData) {
  const oldGuild = client.caches.guilds.get(data.id);
  const guild = client.guilds.updateOrSet(data.id, data);

  // When a Guild becomes available again to the client
  if (oldGuild) {
    if (!guild.available && !data.unavailable) return;
  }

  // When the current user joins a new Guild
  if (client.ready) client.emit(Events.GuildCreate, guild as Guild);
}

export { handle };
