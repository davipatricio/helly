import type { Client } from '../client';

export class GuildManager {
  /**
   * The client this manager belongs to
   */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  get cache() {
    return this.client.cache.guilds;
  }
}
