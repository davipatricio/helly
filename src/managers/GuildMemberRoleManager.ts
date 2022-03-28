import Collection from '@discordjs/collection';
import { Routes } from 'discord-api-types/v10';
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
   * @param roles The role Ids to apply
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
    return this.guild.members.edit(this.member.id, { roles: Array.isArray(roles) ? roles : [roles] }, reason);
  }

  /**
   * Adds a role (or multiple roles) from the member.
   * @param roles The role Ids to add
   * @param reason Reason for adding the roles
   * @example
   * ```js
   * // Add a single role to the member
   * guildMember.roles.add('391156570408615936')
   * ```
   * @example
   * ```js
   * // Add multiple roles to the member
   * guildMember.roles.add(['391156570408615936', '391156570408615937'])
   * ```
   */
  async add(roles: string | string[] = [], reason = '') {
    if (roles instanceof Collection || Array.isArray(roles)) {
      const finalRoles: string[] = [];
      for (const role of roles.values()) finalRoles.push(role);

      const newRoles = [...new Set(finalRoles.concat(...this.cache.keys()))];
      return this.guild.members.edit(this.member.id, { roles: newRoles }, reason);
    }

    await this.client.rest.make(Routes.guildMemberRole(this.guild.id, this.member.id, roles), 'Put', undefined, { 'X-Audit-Log-Reason': reason });
    return undefined;
  }

  /**
   * Removes a role (or multiple roles) from the member.
   * @param roles The role Ids to remove
   * @param reason Reason for removing the roles
   * @example
   * ```js
   * // Remove a single role from the member
   * guildMember.roles.remove('391156570408615936')
   * ```
   * @example
   * ```js
   * // Remove multiple roles from the member
   * guildMember.roles.remove(['391156570408615936', '391156570408615937'])
   * ```
   */
  async remove(roles: string | string[] = [], reason = '') {
    if (roles instanceof Collection || Array.isArray(roles)) {
      const finalRoles: string[] = [];
      for (const role of roles.values()) finalRoles.push(role);

      const newRoles = [...this.cache.filter(role => !finalRoles.includes(role.id)).keys()];
      return this.guild.members.edit(this.member.id, { roles: newRoles }, reason);
    }

    await this.client.rest.make(Routes.guildMemberRole(this.guild.id, this.member.id, roles), 'Delete', undefined, { 'X-Audit-Log-Reason': reason });
    return undefined;
  }
}

export { GuildMemberRoleManager };
