import { LimitedMap } from '../utils/LimitedMap';
import type { Client } from '../client/Client';
import type { GuildMember } from '../structures/GuildMember';

/**
 * Manages API methods for GuildMembers and stores their cache.
 */
class GuildMemberManager {
	cache: LimitedMap<string, GuildMember>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}

	fetch() {
		// TODO: fetch members
	}
}

export { GuildMemberManager };