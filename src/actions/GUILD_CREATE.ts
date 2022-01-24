import { Guild } from '../structures/Guild';
import type { Client } from '../client/Client';

function handle(client: Client, guildData: any): void {
	const guild = new Guild(client, guildData);
	client.guilds.cache.set(guild.id, guild);
	/**
	 * Emitted whenever the client joins a guild.
	 * @event Client#guildCreate
	 * @param {Guild} guild The created guild
	 */
	if (client.ready) client.emit('guildCreate', guild);
}

export { handle };