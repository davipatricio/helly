import {LimitedMap} from '../utils/LimitedMap.js';
import type { GuildMember } from '../structures/GuildMember.js';

/**
 * Manages API methods for GuildMembers and stores their cache.
 */
class GuildMemberManager {
	cache: LimitedMap<string, GuildMember>;
	constructor(limit: number) {
		this.cache = new LimitedMap(limit);
	}

	fetch() {
		// TODO: fetch members
	}
}

export { GuildMemberManager };