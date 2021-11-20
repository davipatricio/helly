import LimitedMap from '../utils/LimitedMap';

import type Client from '../client/Client';
import type GuildChannel from '../structures/GuildChannel';

class ChannelManager {
  client: Client;
  cache: LimitedMap<string, GuildChannel>;
  constructor(client: Client, limit: number) {
    this.cache = new LimitedMap(limit);
    this.client = client;
  }
}

export default ChannelManager;
