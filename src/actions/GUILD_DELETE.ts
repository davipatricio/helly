import { Guild } from '../structures/Guild';

import type { Client } from '../client/Client';

function handle(client: Client, guildData: any) {
	const guild = client.guilds.cache.get(guildData.id) ?? new Guild(client, guildData);
	/**
	 * Emitted whenever a guild kicks the client or the guild is deleted/left.
	 * @event Client#guildDelete
	 * @param {Guild} guild The guild that was deleted
	 */
	if (client.ready) client.emit('guildDelete', guild);
	client.guilds.cache.delete(guild.id);
}

export { handle };