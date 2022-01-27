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

	client.emit('guildMembersChunk', _parsedMembers, guild, { chunkIndex, chunkCount, nonce });
}

export { handle };