import Collection from '@discordjs/collection';
import type { Client } from '../client/Client';
import type { Guild } from '../structures/Guild';
import type { GuildMember } from '../structures/GuildMember';
import type { Role } from '../structures/Role';

// TODO: GuildMemberRoleManager methods (.set, .add, .remove etc)

/** Manages API methods for {@link GuildMember#roles} */
class GuildMemberRoleManager {
  /** The client that instantiated this Manager */
  client: Client;
  /** The {@link Guild} belonging to this manager */
  guild: Guild;
  /** The {@link GuildMember} belonging to this manager */
  member: GuildMember;
  constructor(client: Client, guild: Guild, member: GuildMember) {
    this.client = client;
    this.guild = guild;
    this.member = member;
  }

  /** The roles of this member */
  get cache(): Collection<string, Role> {
    if (!this.guild) return new Collection();

    const guildRoles = this.guild.roles;
    const memberRoles = guildRoles.cache.filter(r => this.member.data.roles.includes(r.id));
    return guildRoles.everyone ? memberRoles.set(guildRoles.everyone.id, guildRoles.everyone) : memberRoles;
  }

  /**
   * Sets the roles applied to the member
   * @param roles The role ids to apply
   * @param reason Reason for applying the roles
   * @example
   * ```js
   * // Set the member's roles to a single role
    guildMember.roles.set(['391156570408615936'])
   * ```
   * @example
   * ```js
   * // Remove all the roles from a member
    guildMember.roles.set([])
   * ```
   */
  set(roles: string | string[] = [], reason = '') {
    return this.guild.members.edit(this.member.id as string, { roles: Array.isArray(roles) ? roles : [roles] }, reason);
  }
}

export { GuildMemberRoleManager };
