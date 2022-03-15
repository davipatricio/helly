import type { APIGuildMember } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
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
    if (!this.data.user) return undefined;
    return this.client.users.updateOrSet(this.data.user.id, this.data.user);
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

  /** @private */
  parseData(data: APIGuildMember) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { GuildMember };
