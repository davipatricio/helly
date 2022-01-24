import { LimitedMap } from '../utils/LimitedMap';
import { User } from '../structures/User';
import type { Client } from '../client/Client';

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
	async fetch(id: string) {
		const data = await this.client.requester.make(`users/${id}`, 'GET');
		return new User(this.client, data);
	}

	async createDM(recipient_id: string): Promise<string> {
		const data = await this.client.requester.make('users/@me/channels', 'POST', { recipient_id });
		return data.id;
	}
}

export { UserManager };