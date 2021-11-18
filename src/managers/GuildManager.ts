import LimitedMap from '../utils/LimitedMap';
import type Client from '../client/Client';
import type Guild from '../structures/Guild';

class GuildManager {
  client: Client;
  cache: LimitedMap<string, Guild>;
  constructor(client: Client, limit: number) {
    this.cache = new LimitedMap(limit);
    this.client = client;
  }
}

export default GuildManager;
