import type { Client } from '../client/Client';
import type { Role } from '../structures/Role';
import { LimitedMap } from '../utils/LimitedMap';

/**
 * Manages API methods for Role and stores their cache.
 */
class RoleManager {
	cache: LimitedMap<string, Role>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}
}

export { RoleManager };
