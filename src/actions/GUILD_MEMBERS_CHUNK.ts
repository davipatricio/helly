import type { Client } from '../client/Client';
import { GuildMember } from '../structures/GuildMember';

function handle(client: Client, chunkData: any): void {
	const guildId: string = chunkData.guild_id;
	const guild = client.guilds.cache.get(guildId);
	if (!guild) return;
	const members: any[] = chunkData.members;
	const chunkIndex: number = chunkData.chunk_index;
	const chunkCount: number = chunkData.chunk_count;
	const nonce: string = chunkData.nonce;

	const _parsedMembers: Map<string, GuildMember> = new Map();
	for (const member of members) {
		const _member = guild.members.cache.get(member.user.id)?._update(member) ?? new GuildMember(client, member, guild);
		_parsedMembers.set(_member.user.id, _member);
	}

	/**
	 * Represents the properties of a guild members chunk
	 * @typedef {Object} GuildMembersChunk
	 * @property {number} chunkIndex - Index of the received chunk
	 * @property {number} chunkCount - Number of chunks the client should receive
	 * @property {?string} nonce - Nonce for this chunk
	 */

	/**
	 * Emitted whenever a chunk of guild members is received (all members come from the same guild).
	 * @event Client#guildMembersChunk
	 * @param {Map<string, GuildMember>} members - The members in the chunk
	 * @param {Guild} guild - The guild related to the member chunk
	 * @param {GuildMembersChunk} chunk - Properties of the received chunk
	 */
	client.emit('guildMembersChunk', _parsedMembers, guild, { chunkIndex, chunkCount, nonce });
}

export { handle };