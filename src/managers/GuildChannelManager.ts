import { LimitedMap } from '../utils/LimitedMap';
import type { Channel } from '../structures/Channel';

class GuildChannelManager {
	cache: LimitedMap<string, Channel>;
	constructor(limit: number) {
		this.cache = new LimitedMap(limit);
	}
}

export { GuildChannelManager };