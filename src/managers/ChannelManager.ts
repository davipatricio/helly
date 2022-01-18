import {LimitedMap} from '../utils/LimitedMap.js';
import type {Channel} from '../structures/Channel.js';

class ChannelManager {
	cache: LimitedMap<string, Channel>;
	constructor(limit: number) {
		this.cache = new LimitedMap(limit);
	}
}

export {ChannelManager};