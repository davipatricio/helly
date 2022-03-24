import type { APIRole } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import type { Guild } from '../structures/Guild';
import { Role } from '../structures/Role';

// TODO: RoleManager methods (.create, .delete, .fetch etc)

/** Manages API methods for {@link Role}s */
class RoleManager {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  /** The {@link Guild} belonging to this manager */
  guild: Guild;
  constructor(client: Client, guild: Guild) {
    this.client = client;
    this.guild = guild;
  }

  /** A manager of the roles belonging to this guild */
  get cache() {
    return this.client.caches.roles.filter(r => r.guild?.id === this.guild.id);
  }

  /** The role with the highest position in the cache */
  get highest() {
    return this.cache.sort((a, b) => b.position - a.position).first();
  }

  /** The premium subscriber role of the guild, if any */
  get premiumSubscriberRole() {
    return this.cache.find(role => role.tags?.premiumSubscriber !== null) ?? null;
  }

  /** The `@everyone` role of the guild */
  get everyone() {
    return this.cache.get(this.guild.id);
  }

  /**
   * Updates or caches a {@link Role} with the provided {@link APIRole} data
   * @private
   */
  updateOrSet(id: string, data: APIRole, guild: Guild) {
    const cachedRole = this.client.caches.roles.get(id);
    if (cachedRole) return cachedRole.parseData(data);

    const role = new Role(this.client, data, guild);
    this.client.caches.roles.set(id, role);

    return role;
  }
}

export { RoleManager };
