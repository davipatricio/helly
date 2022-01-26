import type { Client } from '../client/Client';
import type { Channel } from '../structures/Channel';
import { LimitedMap } from '../utils/LimitedMap';

class ChannelManager {
	cache: LimitedMap<string, Channel>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}
}

export { ChannelManager };
