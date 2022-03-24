import Collection from '@discordjs/collection';
import type { GatewayGuildMembersChunkDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { GuildMember, Guild } from '../../structures';
import type { Client } from '../Client';

/** Represents the properties of a guild members chunk */
export type GuildMembersChunkEventArgs = {
  /** The members in the chunk */
  members: Collection<string, GuildMember>;
  /** The guild related to the member chunk */
  guild: Guild;
  /** Index of the received chunk */
  chunkIndex: number;
  /** Number of chunks the client should receive */
  chunkCount: number;
  /** Nonce for this chunk */
  nonce?: string;
  notFound: string[];
};

function handle(client: Client, data: GatewayGuildMembersChunkDispatchData) {
  const { guild_id: guildId, chunk_index: chunkIndex, chunk_count: chunkCount, members, nonce, not_found: notFound } = data;
  const guild = client.caches.guilds.get(guildId);
  if (!guild) return;

  const parsedMembers = new Collection<string, GuildMember>();
  for (const rawMember of members) {
    if (!rawMember.user) continue;

    const member = guild.members.updateOrSet(rawMember.user.id, rawMember);
    parsedMembers.set(member.user.id, member);
  }

  client.emit(Events.GuildMembersChunk, { members: parsedMembers, guild, chunkIndex, chunkCount, nonce, notFound });
}

export { handle };
