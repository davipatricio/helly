import type { Client } from '../client/Client';
import { Guild } from '../structures/Guild';
import { LimitedMap } from '../utils/LimitedMap';

/**
 * Manages API methods for Guilds and stores their cache.
 */
class GuildManager {
	cache: LimitedMap<string, Guild>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}

	/**
	 * Obtains one or multiple guilds from Discord, or the guild cache if it's already available.
	 * @param {string | undefined} [id] The guild's id to fetch. If undefined, fetches all guilds.
	 * @returns {Promise<Guild | Map<string, Guild>>}
	 */
	async fetch(id: string | undefined): Promise<Guild | Map<string, Guild>> {
		if (!id) {
			const guilds = await this.client.requester.make('/users/@me/guilds', 'GET');
			const _fetchedGuilds = new Map();

			for (const guild of guilds) {
				const cachedGuild = this.client.guilds.cache.get(guild.id);
				if (cachedGuild) {
					cachedGuild._update(guild);
					_fetchedGuilds.set(guild.id, this.client.guilds.cache.get(guild.id));
					continue;
				}
				const _guild = new Guild(this.client, guild);
				_fetchedGuilds.set(guild.id, _guild);
			}
			return _fetchedGuilds;
		}

		const fetchedGuild = await this.client.requester.make(`/guilds/${id}`, 'GET');
		const cachedGuild = this.client.guilds.cache.get(id)?._update(fetchedGuild) ?? new Guild(this.client, fetchedGuild);
		return cachedGuild;
	}
}

export { GuildManager };
