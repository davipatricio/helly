import LimitedMap from '../utils/LimitedMap';
import type Client from '../client/Client';
import type User from '../structures/User';

class UserManager {
  client: Client;
  cache: LimitedMap<string, User | null>;
  constructor(client: Client, limit: number) {
    this.cache = new LimitedMap(limit);
    this.client = client;
  }
}

export default UserManager;
