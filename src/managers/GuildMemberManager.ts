import type { APIGuildMember } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import type { Guild } from '../structures';
import { GuildMember } from '../structures/GuildMember';
import { LimitedCollection } from '../utils';

// TODO: GuildMemberManager methods (.create, .delete, .fetch etc)

/** Manages API methods for {@link GuildMember}s */
class GuildMemberManager {
  /** The client that instantiated this Manager */
  client: Client;
  /** All of the guilds the client is currently handling, mapped by their ids */
  cache: LimitedCollection<string, GuildMember>;
  /** The {@link Guild} belonging to this manager */
  guild: Guild;
  constructor(client: Client, guild: Guild) {
    this.client = client;
    this.cache = new LimitedCollection(this.client.options.caches.members);
    this.guild = guild;
  }

  /**
   * Updates or caches a {@link Guild} with the provided {@link APIGuild} data
   * @private
   */
  updateOrSet(id: string, data: APIGuildMember) {
    const cachedGuildMember = this.cache.get(id);
    if (cachedGuildMember) return cachedGuildMember.parseData(data);

    const guildMember = new GuildMember(this.client, data, this.guild);
    this.cache.set(id, guildMember);

    return guildMember;
  }
}

export { GuildMemberManager };
