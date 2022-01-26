import type { Client } from '../client/Client';
import type { Channel } from '../structures/Channel';
import type { TextChannel } from '../structures/TextChannel';
import { LimitedMap } from '../utils/LimitedMap';

export type AnyChannel = TextChannel | Channel;

class ChannelManager {
	cache: LimitedMap<string, AnyChannel>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}
}

export { ChannelManager };
