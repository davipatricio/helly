import { APIGuildMember, RESTPatchAPIGuildMemberJSONBody, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import type { Guild } from '../structures';
import { GuildMember } from '../structures/GuildMember';
import { LimitedCollection } from '../utils';

/** The data for editing a guild member */
export interface GuildMemberEditData {
  roles?: string[];
  nick?: string;
  mute?: boolean;
  deaf?: boolean;
  communicationDisabledUntil?: number;
}

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
   * Edits a guild member
   * @param userId - The id of the user to edit
   * @param data - The data to edit the member with
   * @param reason - The reason for editing the member
   * @example
   * ```js
   * guild.members.edit('12345678901234567', { roles: ['12345678901234567'] })
   * ```
   * @example
   * ```js
   * guild.members.edit('12345678901234567', { nick: 'Veric', roles: ['2345678954234590'] })
   * ```
   */
  async edit(userId: string, data: GuildMemberEditData, reason = '') {
    const rawData: RESTPatchAPIGuildMemberJSONBody = { ...data };

    if (data.communicationDisabledUntil) {
      rawData.communication_disabled_until = new Date(data.communicationDisabledUntil).toISOString();
    }

    const rawMember = (await this.client.rest.make(Routes.guildMember(this.guild.id, userId), 'Patch', data, { 'X-Audit-Log-Reason': reason })) as APIGuildMember;
    return this.updateOrSet(userId, rawMember);
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
