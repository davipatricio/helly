import type { Client } from '../client';

export class ChannelManager {
  /**
   * The client this manager belongs to
   */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  get cache() {
    return this.client.cache.channels;
  }
}
