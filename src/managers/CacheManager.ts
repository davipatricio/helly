import type { Client } from '../client/Client';
import type { ClientCacheOptions } from '../client/ClientOptions';
import { LimitedMap } from '../utils/LimitedMap';

// TODO: Add type definitions for structures
class CacheManager {
  /** The client that instantiated this Manager */
  client: Client;
  /** The limits of the caches */
  #limits: ClientCacheOptions;
  /** Map that stores caches of Guilds */
  guilds: LimitedMap<string, unknown>;
  constructor(client: Client, limits: ClientCacheOptions) {
    this.client = client;
    this.#limits = limits;
    this.#createCaches();
  }

  /** Separately create all structure caches with specified limits */
  #createCaches() {
    this.guilds = new LimitedMap(this.#limits.guilds);
  }

  /** Erases all items that are stored in the cache */
  destroy(): this {
    this.guilds.clear();
    return this;
  }
}

export { CacheManager };
