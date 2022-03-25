import type { Client } from '../client/Client';
import type { ClientCacheOptions } from '../client/ClientOptions';
import type { Channel } from '../structures/Channel';
import type { Guild } from '../structures/Guild';
import type { Message } from '../structures/Message';
import type { Role } from '../structures/Role';
import type { User } from '../structures/User';
import { LimitedCollection } from '../utils/LimitedCollection';

class CacheManager {
  /** The client that instantiated this Manager */
  client: Client;
  /** The limits of the caches */
  #limits: ClientCacheOptions;
  /** Map that stores caches of {@link Guild}s */
  guilds: LimitedCollection<string, Guild>;
  /** Map that stores caches of {@link Role}s */
  roles: LimitedCollection<string, Role>;
  /** Map that stores caches of {@link Channel}s */
  channels: LimitedCollection<string, Channel>;
  /** Map that stores caches of {@link User}s */
  users: LimitedCollection<string, User>;
  /** Map that stores caches of {@link Message}s */
  messages: LimitedCollection<string, Message>;
  constructor(client: Client, limits: ClientCacheOptions) {
    this.client = client;
    this.#limits = limits;
    this.#createCaches();
  }

  /** Separately create all structure caches with specified limits */
  #createCaches() {
    this.guilds = new LimitedCollection(this.#limits.guilds);
    this.roles = new LimitedCollection(this.#limits.roles);
    this.channels = new LimitedCollection(this.#limits.channels);
    this.users = new LimitedCollection(this.#limits.users);
    this.messages = new LimitedCollection(this.#limits.messages);
  }

  /** Erases all items that are stored in the cache */
  destroy() {
    this.guilds.clear();
    this.roles.clear();
    this.channels.clear();
    this.users.clear();
    this.messages.clear();
    return this;
  }
}

export { CacheManager };
