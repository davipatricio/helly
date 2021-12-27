import LimitedMap from '../utils/LimitedMap.js';
import type User from '../structures/User.js';
import type Client from '../client/Client.js';

class UserManager {
	cache: LimitedMap<string, User>;
	constructor(limit: number) {
		this.cache = new LimitedMap(limit);
	}

	async createDM(client: Client, userId: string): Promise<string> {
		const data = await client.requester.make('users/@me/channels', 'POST', {
			recipient_id: userId,
		});
		return data.id;
	}
}

export default UserManager;