import type { APIGuildMember } from 'discord-api-types/v10';
import type { APIUser } from 'discord-api-types/v9';
import type { Client } from '../client/Client';
import type { GuildMemberEditData } from '../managers';
import { GuildMemberRoleManager } from '../managers/GuildMemberRoleManager';
import { BaseStructure } from './BaseStructure';
import type { Guild } from './Guild';

class GuildMember extends BaseStructure {
  /** Raw member data */
  data: APIGuildMember;
  /** The id of the {@link Guild} the member is in */
  guildId: string;
  constructor(client: Client, data: APIGuildMember, guild: Guild) {
    super(client);
    this.parseData(data);
    this.guildId = guild.id;
  }

  /** The time this member's timeout will be removed */
  get communicationDisabledUntil() {
    return this.data.communication_disabled_until ? new Date(this.data.communication_disabled_until) : undefined;
  }

  /** The timestamp this member's timeout will be removed */
  get communicationDisabledUntilTimestamp() {
    return this.data.communication_disabled_until ? Date.parse(this.data.communication_disabled_until) : undefined;
  }

  /** The id of the member */
  get id() {
    return this.user?.id;
  }

  /** The {@link User} object of the member */
  get user() {
    return this.client.users.updateOrSet((this.data.user as APIUser).id, this.data.user as APIUser);
  }

  /** The nick of the member */
  get nick() {
    return this.data.nick ?? null;
  }

  /** The time this member joined the guild */
  get joinedAt() {
    return new Date(this.data.joined_at);
  }

  /** The timestamp the member joined the guild at */
  get joinedTimestamp() {
    return Date.parse(this.data.joined_at);
  }

  /** The last time this member started boosting the guild */
  get premiumSince() {
    return this.data.premium_since ? new Date(this.data.premium_since) : null;
  }

  /** The last timestamp this member started boosting the guild */
  get premiumSinceTimestamp() {
    return this.data.premium_since ? Date.parse(this.data.premium_since) : null;
  }

  /** The {@link Guild} object the member is in */
  get guild() {
    return this.client.caches.guilds.get(this.guildId);
  }

  /**
   * The roles of the member
   * @example
   * ```js
   * guildMember.roles.cache.map(r => r.name).join(', ');
   * ```
   * @example
   * ```js
   * guildMember.set([], 'They don\'t deserve roles');
   * ```
   */
  get roles() {
    return new GuildMemberRoleManager(this.client, this.guild as Guild, this);
  }

  /**
   * Edits this member
   * @param data - The data to edit the member with
   * @param reason - The reason for editing the member
   * @example
   * ```js
   * guildMember.edit({ roles: ['12345678901234567'] })
   * ```
   * @example
   * ```js
   * guildMember.edit({ nick: 'Veric', roles: ['2345678954234590'] })
   * ```
   */
  edit(data: GuildMemberEditData, reason = '') {
    if (!this.guild || !this.id) return undefined;
    return this.guild.members.edit(this.id, data, reason);
  }

  /** Fetches this GuildMember */
  fetch() {
    if (!this.guild) return undefined;
    return this.guild.members.fetch(this.id) as Promise<GuildMember>;
  }

  /** @private */
  parseData(data: APIGuildMember) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { GuildMember };
