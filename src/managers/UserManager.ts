import { LimitedMap } from '../utils/LimitedMap';
import type { User } from '../structures/User';
import type { Client } from '../client/Client';

class UserManager {
	cache: LimitedMap<string, User>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}

	async createDM(recipient_id: string): Promise<string> {
		const data = await this.client.requester.make('users/@me/channels', 'POST', { recipient_id });
		return data.id;
	}
}

export { UserManager };