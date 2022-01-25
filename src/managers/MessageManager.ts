import type { Client } from '../client/Client';
import type { Message } from '../structures/Message';
import { LimitedMap } from '../utils/LimitedMap';

/**
 * Manages API methods for Messages and stores their cache.
 */
class MessageManager {
	cache: LimitedMap<string, Message>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}
}

export { MessageManager };
