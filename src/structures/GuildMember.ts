import type { APIGuildMember } from 'discord-api-types/v10';
import type { APIUser } from 'discord-api-types/v9';
import type { Client } from '../client/Client';
import type { GuildMemberEditData } from '../managers';
import { GuildMemberRoleManager } from '../managers/GuildMemberRoleManager';
import { PermissionsBitField } from '../utils/bitfield/PermissionsBitField';
import { BaseStructure } from './BaseStructure';
import type { Guild } from './Guild';

/** Options used to ban a user from a guild */
export interface BanOptions {
  /**
   * Number of days of messages to delete, must be between 0 and 7
   * @defaultValue `0`
   */
  days?: number;
  /** The reason for the ban */
  reason?: string;
}

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

  /** The overall set of permissions for this member, taking only roles and owner status into account */
  get permissions() {
    const totalBitfield = this.roles.cache.map(r => r.permissions.bitfield).reduce((a, b) => a | b, 0n);
    const permissionBitfield = new PermissionsBitField(totalBitfield);
    return permissionBitfield;
  }

  /**
   * Edits this member
   * @param data The data to edit the member with
   * @param reason The reason for editing the member
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
    return this.guild.members.fetch(this.id);
  }

  /**
   * Bans this member from the guild
   * @param options Options for the ban
   * @example
     ```js
      guildMember.ban()
     ```
   * @example
     ```js
      guildMember.ban({ reason: 'Spamming', days: 1 })
     ```
   */
  ban(options: BanOptions = { days: 0, reason: '' }) {
    if (!this.guild) return undefined;
    return this.guild.members.ban(this.user.id, options);
  }

  /**
   * Kicks this member from the guild
   * @param reason Reason for kicking user
   */
  kick(reason = '') {
    if (!this.guild) return undefined;
    return this.guild.members.kick(this.user.id, reason);
  }

  /** Returns the mention of the member */
  override toString() {
    return `<@!${this.id}>`;
  }

  /** @private */
  parseData(data: APIGuildMember) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { GuildMember };
