import type { APIGuild } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import type { GuildChannelManager as GuildChannelManagerType } from '../managers/GuildChannelManager';
import { GuildMemberManager } from '../managers/GuildMemberManager';
import { RoleManager } from '../managers/RoleManager';
import { Snowflake } from '../utils/Snowflake';
import { BaseStructure } from './BaseStructure';
import type { Channel } from './Channel';

class Guild extends BaseStructure {
  /** Raw guild data */
  data: APIGuild;
  /** A manager of the {@link Role}s belonging to this guild */
  roles: RoleManager;
  /** A manager of the {@link Channel}s belonging to this guild */
  channels: GuildChannelManagerType;
  /** A manager of the {@link GuildMember}s belonging to this guild */
  members: GuildMemberManager;
  constructor(client: Client, data: APIGuild) {
    super(client);
    this.roles = new RoleManager(client, this);

    // For some reason this is a cyclic dependency
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { GuildChannelManager } = require('../managers/GuildChannelManager');
    this.channels = new GuildChannelManager(client, this);
    this.members = new GuildMemberManager(client, this);
    this.parseData(data);
  }

  /** Whether the guild is available */
  get available() {
    return Boolean(!this.data.unavailable);
  }

  /** The id of the voice channel where AFK members are moved */
  get afkChannelId() {
    return this.data.afk_channel_id;
  }

  /** The {@link Channel | object} of the voice channel where AFK members are moved */
  get afkChannel(): Channel | undefined {
    return !this.afkChannelId ? undefined : this.client.caches.channels.get(this.afkChannelId);
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

  /** The time the guild was created at */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /** The timestamp the guild was created at */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id);
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
    return this.client.users.cache.get(this.ownerId);
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

  /** The name of this guild */
  get name() {
    return this.data.name;
  }

  /** The guild's id */
  get id() {
    return this.data.id;
  }

  /** Fetches the owner of the guild. If the member object isn't needed, use {@link Guild.ownerId} instead */
  fetchOwner() {
    return this.client.users.fetch(this.ownerId);
  }

  /** Fetches this guild */
  fetch() {
    return this.client.guilds.fetch(this.id);
  }

  /** @private */
  parseData(data: APIGuild) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    data.roles?.forEach(apiRole => {
      this.roles.updateOrSet(apiRole.id, apiRole, this);
    });
    data.members?.forEach(apiMember => {
      if (!apiMember.user) return;
      this.members.updateOrSet(apiMember.user.id, apiMember);
    });
    data.channels?.forEach(apiChannel => {
      this.client.channels.updateOrSet(apiChannel.id, apiChannel, this);
    });

    return this;
  }
}

export { Guild };
