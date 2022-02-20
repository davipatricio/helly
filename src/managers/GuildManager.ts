import type { Client } from '../client/Client';

// TODO: GuildManager methods (.create, .delete, .fetch etc)

/** Manages API methods for Guilds */
class GuildManager {
  /** The client that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }
}

export { GuildManager };
