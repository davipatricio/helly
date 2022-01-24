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
		const _member = new GuildMember(client, member, guild);

		client.users.cache.set(_member.user.id, _member.user);
		guild.members.cache.set(_member.user.id, _member);

		_parsedMembers.set(_member.user.id, _member);
	}

	client.emit('guildMembersChunk', _parsedMembers, guild, { chunkIndex, chunkCount, nonce });
}

export { handle };