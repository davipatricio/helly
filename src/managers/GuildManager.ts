import type { Client } from '../client/Client';

// TODO: GuildManager methods (.create, .delete, .fetch etc)
class GuildManager {
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }
}

export { GuildManager };
