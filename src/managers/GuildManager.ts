import type { APIGuild } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Guild } from '../structures/Guild';

// TODO: GuildManager methods (.create, .delete, .fetch etc)

/** Manages API methods for {@link Guild}s */
class GuildManager {
  /** The client that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /** All of the guilds the client is currently handling, mapped by their ids */
  get cache() {
    return this.client.caches.guilds;
  }

  /**
   * Updates or caches a {@link Guild} with the provided {@link APIGuild} data
   * @private
   */
  updateOrSet(id: string, data: APIGuild) {
    const cachedGuild = this.client.caches.guilds.get(id);
    if (cachedGuild) return cachedGuild.parseData(data);

    const guild = new Guild(this.client, data);
    this.client.caches.guilds.set(id, guild);

    return guild;
  }
}

export { GuildManager };
