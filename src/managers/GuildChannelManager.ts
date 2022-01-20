import { LimitedMap } from '../utils/LimitedMap';
import type { Channel } from '../structures/Channel';
import type { Client } from '../client/Client';

class GuildChannelManager {
	cache: LimitedMap<string, Channel>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}
}

export { GuildChannelManager };