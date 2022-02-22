import type { Client } from '../client/Client';
import type { ClientCacheOptions } from '../client/ClientOptions';
import type { Guild } from '../structures/Guild';
import type { Role } from '../structures/Role';
import { LimitedCollection } from '../utils/LimitedCollection';

// TODO: Add type definitions for structures
class CacheManager {
  /** The client that instantiated this Manager */
  client: Client;
  /** The limits of the caches */
  #limits: ClientCacheOptions;
  /** Map that stores caches of {@link Guild}s */
  guilds: LimitedCollection<string, Guild>;
  /** Map that stores caches of {@link Role}s */
  roles: LimitedCollection<string, Role>;
  constructor(client: Client, limits: ClientCacheOptions) {
    this.client = client;
    this.#limits = limits;
    this.#createCaches();
  }

  /** Separately create all structure caches with specified limits */
  #createCaches() {
    this.guilds = new LimitedCollection(this.#limits.guilds);
    this.roles = new LimitedCollection(this.#limits.roles);
  }

  /** Erases all items that are stored in the cache */
  destroy() {
    this.guilds.clear();
    this.roles.clear();
    return this;
  }
}

export { CacheManager };
