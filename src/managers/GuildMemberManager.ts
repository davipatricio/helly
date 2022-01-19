import {LimitedMap} from '../utils/LimitedMap';
import type { GuildMember } from '../structures/GuildMember';

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