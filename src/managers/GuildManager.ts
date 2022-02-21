import type { APIGuild } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Guild } from '../structures/Guild';

// TODO: GuildManager methods (.create, .delete, .fetch etc)

/** Manages API methods for Guilds */
class GuildManager {
  /** The client that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /** Shortcut to {@link CacheManager.guilds} */
  get cache() {
    return this.client.caches.guilds;
  }

  /**
   * Updates or caches a guild with the provided {@link APIGuild} data
   * @private
   */
  updateOrSet(id: string, data: APIGuild) {
    const cachedGuild = this.client.caches.guilds.get(id);
    return cachedGuild ? cachedGuild.parseData(data) : this.client.caches.guilds.set(id, new Guild(this.client, data));
  }
}

export { GuildManager };
