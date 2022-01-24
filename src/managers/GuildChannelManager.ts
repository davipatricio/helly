import type { Client } from '../client/Client';
import { Channel } from '../structures/Channel';
import { LimitedMap } from '../utils/LimitedMap';

class GuildChannelManager {
	cache: LimitedMap<string, Channel>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}

	/**
	 * Deletes the channel.
	 * @param {string} reason - The reason for deleting this channel
	 * @returns {Promise<void>}
	 */
	async delete(id: string, reason?: string) {
		if (typeof id === 'undefined') throw new Error('The provided channel id is undefined.');
		const data = await this.client.requester.make(`channels/${id}`, 'DELETE', '', { 'X-Audit-Log-Reason': reason });
		return new Channel(this.client, data);
	}
}

export { GuildChannelManager };
