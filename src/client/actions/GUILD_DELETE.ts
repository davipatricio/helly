import type { GatewayGuildDeleteDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayGuildDeleteDispatchData) {
  const guild = client.caches.guilds.get(data.id);

  if (guild) {
    // When a guild becomes or was already unavailable due to an outage
    if (data.unavailable) {
      guild.data.unavailable = true;
      client.emit(Events.GuildUnavailable, guild);
      return;
    }

    if (client.ready) client.emit(Events.GuildDelete, guild);

    for (const channel of guild.channels.cache.values()) client.caches.channels.delete(channel.id);
    for (const role of guild.roles.cache.values()) client.caches.roles.delete(role.id);

    client.caches.guilds.delete(guild.id);
  }
}

export { handle };
