import type { APIGuild } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { RoleManager } from '../managers/RoleManager';
import { BaseStructure } from './BaseStructure';

class Guild extends BaseStructure {
  /** Raw {@link Guild} data */
  data: APIGuild;
  /** A manager of the roles belonging to this {@link Guild} */
  roles: RoleManager;
  constructor(client: Client, data: APIGuild) {
    super(client);
    this.roles = new RoleManager(client, this);
    this.parseData(data);
  }

  /** The id of the voice channel where AFK members are moved */
  get afkChannelId() {
    return this.data.afk_channel_id;
  }

  get afkChannel() {
    // TODO: fetch/cache afk channel
    return null;
  }

  /** The time in seconds before a user is counted as "away from keyboard" */
  get afkTimeout() {
    return this.data.afk_timeout;
  }

  /** The approximate amount of members the guild has */
  get approximateMemberCount() {
    return this.data.approximate_member_count;
  }

  /** The approximate amount of presences the guild has */
  get approximatePresenceCount() {
    return this.data.approximate_presence_count;
  }

  /** The description of the guild, if any */
  get description() {
    return this.data.description;
  }

  /** The user id of this guild's owner */
  get ownerId() {
    return this.data.owner_id;
  }

  get owner() {
    // TODO: get guild owner from GuildMemberManager cache
    return null;
  }

  /** An array of features available to this guild */
  get features() {
    return this.data.features;
  }

  /** Whether the guild is "large" (has more than {@link WebSocketOptions.largeThreshold} members, `50` by default) */
  get large() {
    return this.data.large || false;
  }

  /** The full amount of members in this guild */
  get memberCount() {
    return this.data.member_count;
  }

  /** Name of this guild */
  get name() {
    return this.data.name;
  }

  /** The guild's id */
  get id() {
    return this.data.id;
  }

  fetchOwner() {
    // TODO: fetch/cache guild owner
    return null;
  }

  /** @private */
  parseData(data: APIGuild): this {
    if (!data) return this;
    this.data = { ...this.data, ...data };
    // TODO: parse channels, members etc
    if (this.data.roles) {
      this.data.roles.forEach(apiRole => {
        this.roles.updateOrSet(apiRole.id, apiRole, this);
      });
    }
    return this;
  }
}

export { Guild };
