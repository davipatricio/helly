import type { Client } from '../client/Client';
import type { Guild } from '../structures/Guild';
import { GuildMember } from '../structures/GuildMember';
import { LimitedMap } from '../utils/LimitedMap';
import { Snowflake } from '../utils/Snowflake';

type MemberMap = Map<string, GuildMember>
interface FetchAllType {
	limit: number;
	query: string;
	guild_id: string;
	nonce: string;
}

/**
 * Manages API methods for GuildMembers and stores their cache.
 */
class GuildMemberManager {
	cache: LimitedMap<string, GuildMember>;
	client: Client;
	guild: Guild;
	constructor(client: Client, limit: number, guild: Guild) {
		this.cache = new LimitedMap(limit);
		this.client = client;
		this.guild = guild;
	}

	/**
	 * Fetches member(s) from Discord, even if they're offline.
	 * @param {string|undefined} [id] - If a ID, the user to fetch. If undefined, fetches all members.
	 * @returns {Promise<GuildMember|Map<string, GuildMember>>}
	 */
	async fetch(id: string | undefined): Promise<GuildMember|Map<string, GuildMember>> {
		if (!id) return this._fetchAll({ limit: 0, guild_id: this.guild.id, query: '', nonce: Snowflake.generate() });

		const data = await this.client.requester.make(`/guilds/${this.guild.id}/members/${id}`, 'GET');
		const _member = new GuildMember(this.client, data, this.guild);
		this.cache.set(id, _member);
		this.client.users.cache.set(id, _member.user);
		return _member;
	}

	async _fetchAll(options: FetchAllType): Promise<MemberMap> {
		const requestData = JSON.stringify({ op: 8, d: options });
		await this.client.ws.connection.send(requestData);
		return new Promise(resolve => {
			const _finalMembers: MemberMap = new Map();
			let chunkIndex = 0;
			let chunkCount = 0;
			const handler = (members: MemberMap, _guild: Guild, additional: any) => {
				if (additional.nonce !== options.nonce) return;
				chunkCount = additional.chunkCount;
				chunkIndex = additional.chunkIndex;
				for(const member of members.values()) _finalMembers.set(member.user.id, member);
				if (chunkCount === (chunkIndex + 1)) {
					this.client.off('guildMembersChunk', handler);
					this.client.decrementMaxListeners();
					return resolve(_finalMembers);
				}
			};
			this.client.on('guildMembersChunk', handler);
			this.client.incrementMaxListeners();
		});
	}
}

export { GuildMemberManager };
