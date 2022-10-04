import type { Guild, User } from '@hellyjs/structures';
import type { Client } from '../client';
import { LimitedMap } from '../utils';

export class CacheManager {
  /**
   * A map containing all the cached channels (threads, guild channels, DMs etc)
   */
  channels: LimitedMap<unknown>;
  /**
   * The client this manager belongs to
   */
  client: Client;
  /**
   * A map containing all the cached guilds
   */
  guilds: LimitedMap<Guild>;
  /**
   * A map containing all the cached users
   */
  users: LimitedMap<User>;
  constructor(client: Client) {
    this.client = client;
    this.#setupCaches();
  }

  #setupCaches() {
    this.channels = new LimitedMap(this.client.options.cache.channels!);
    this.guilds = new LimitedMap(this.client.options.cache.guilds!);
    this.users = new LimitedMap(this.client.options.cache.users!);
  }
}
