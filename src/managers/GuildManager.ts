import Collection from '@discordjs/collection';
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
   * Obtains one or multiple guilds from Discord, or the guild cache if it's already available
   * @param id The guild's id to fetch. If undefined, fetches all guilds
   */
  fetch(id: string): Promise<Guild>;
  fetch(id?: string): Promise<Collection<string, Guild>>;
  async fetch(id?: string) {
    if (!id) {
      const guilds = (await this.client.rest.make('/users/@me/guilds', 'Get')) as APIGuild[];
      const fetchedGuilds = new Collection<string, Guild>();

      for (const guild of guilds) {
        const data = this.updateOrSet(guild.id, guild);
        fetchedGuilds.set(guild.id, data);
      }
      return fetchedGuilds;
    }

    const fetchedGuild = (await this.client.rest.make(`/guilds/${id}`, 'Get')) as APIGuild;
    const cachedGuild = this.updateOrSet(id, fetchedGuild);
    return cachedGuild;
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
