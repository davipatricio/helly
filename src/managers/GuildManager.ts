import { LimitedMap } from '../utils/LimitedMap';
import { Guild } from '../structures/Guild';
import type { Client } from '../client/Client';

class GuildManager {
	cache: LimitedMap<string, Guild>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}

	async fetch(id: string): Promise<Guild | Map<string, Guild>> {
		if (!id) {
			const guilds = await this.client.requester.make('/users/@me/guilds', 'GET');
			const _fetchedGuilds = new Map();

			for (const guild of guilds) {
				const cachedGuild = this.client.guilds.cache.get(guild.id);
				if (cachedGuild) {
					cachedGuild.parseData(guild);
					_fetchedGuilds.set(guild.id, this.client.guilds.cache.get(guild.id));
					continue;
				}
				const _guild = new Guild(this.client, guild);
				this.client.guilds.cache.set(guild.id, _guild);
				_fetchedGuilds.set(guild.id, _guild);
			}
			return _fetchedGuilds;
		}

		const fetchedGuild = await this.client.requester.make(`/guilds/${id}`, 'GET');
		const cachedGuild = this.client.guilds.cache.get(id);
		if (cachedGuild) {
			cachedGuild.parseData(fetchedGuild);
			return this.client.guilds.cache.get(id) ?? new Guild(this.client, fetchedGuild);
		}
		const _guild = new Guild(this.client, fetchedGuild);
		this.client.guilds.cache.set(id, _guild);
		return _guild;
	}
}

export { GuildManager };