import type { APIRole } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import type { Guild } from '../structures/Guild';
import { Role } from '../structures/Role';

// TODO: RoleManager methods (.create, .delete, .fetch etc)

/** Manages API methods for {@link Role}s */
class RoleManager {
  /** The client that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /** Shortcut to {@link CacheManager.roles} */
  get cache() {
    return this.client.caches.roles;
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
