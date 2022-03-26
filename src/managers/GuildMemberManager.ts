import Collection from '@discordjs/collection';
import { APIGuildMember, GatewayRequestGuildMembersData, RESTPatchAPIGuildMemberJSONBody, Routes } from 'discord-api-types/v10';
import type { GuildMembersChunkEventArgs } from '../client/actions/GUILD_MEMBERS_CHUNK';
import type { Client } from '../client/Client';
import { Events } from '../constants';
import type { Guild } from '../structures';
import { GuildMember } from '../structures/GuildMember';
import { LimitedCollection, Snowflake } from '../utils';

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
   * Fetches member(s) from this guild, even if they're offline
   * @param id If a ID, the user to fetch. If undefined, fetches all members
   */
  fetch(id: string): Promise<GuildMember>;
  fetch(id?: string): Promise<Collection<string, GuildMember>>;
  async fetch(id?: string) {
    if (!id) return this.#fetchAll({ limit: 0, guild_id: this.guild.id, query: '', nonce: Snowflake.generate() });

    const data = (await this.client.rest.make(Routes.guildMember(this.guild.id, id), 'Get')) as APIGuildMember;
    const member = this.updateOrSet(id, data);
    return member;
  }

  /**
   * Kicks a user from the guild
   * @param userId The member to kick
   * @param reason Reason for kicking
   */
  async kick(userId: string, reason = '') {
    await this.client.rest.make(Routes.guildMember(this.guild.id, userId), 'Delete', undefined, { 'X-Audit-Log-Reason': reason });
    return undefined;
  }

  /** @private */
  #fetchAll(options: GatewayRequestGuildMembersData): Promise<Collection<string, GuildMember>> {
    const requestData = JSON.stringify({ op: 8, d: options });
    this.client.ws.send(requestData);

    return new Promise(resolve => {
      const finalMembers = new Collection<string, GuildMember>();
      let chunkIndex = 0;
      let chunkCount = 0;
      const handler = (data: GuildMembersChunkEventArgs) => {
        if (data.nonce !== options.nonce) return;

        chunkCount = data.chunkCount;
        chunkIndex = data.chunkIndex;

        for (const member of data.members.values()) finalMembers.set(member.user.id, member);

        if (chunkCount === chunkIndex + 1) {
          this.client.off(Events.GuildMembersChunk, handler);
          this.client.decrementMaxListeners();
          resolve(finalMembers);
        }
      };
      this.client.on(Events.GuildMembersChunk, handler);
      this.client.incrementMaxListeners();
    });
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
