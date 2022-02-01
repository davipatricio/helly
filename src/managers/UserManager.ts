import type { Client } from '../client/Client';
import { DMChannel } from '../structures/DMChannel';
import { User } from '../structures/User';
import { LimitedMap } from '../utils/LimitedMap';

/**
 * Manages API methods for Users and stores their cache.
 */
class UserManager {
	cache: LimitedMap<string, User>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}

	/**
	 * Obtains a user from Discord
	 * @param {string} id The user to fetch
	 * @returns {Promise<User>}
	 */
	async fetch(id: string): Promise<User> {
		const data = await this.client.requester.make(`users/${id}`, 'GET');
		return this.client.users.cache.get(data.id)?._update(data) ?? new User(this.client, data);
	}

	async createDM(recipient_id: string) {
		const data = await this.client.requester.make('users/@me/channels', 'POST', { recipient_id });
		const dm = this.client.channels._getChannel(data.id)?._update(data) ?? new DMChannel(this.client, data);
		return dm as DMChannel;
	}
}

export { UserManager };
