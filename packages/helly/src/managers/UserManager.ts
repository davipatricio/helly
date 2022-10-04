import type { Client } from '../client';

/**
 * A manager of users belonging to a client
 */
export class UserManager {
  /**
   * The client this manager belongs to
   */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  get cache() {
    return this.client.cache.users;
  }
}
