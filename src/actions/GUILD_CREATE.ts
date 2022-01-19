import type { Client } from '../client/Client';

import { Guild } from '../structures/Guild.js';

function handle(client: Client, guildData: any) {
	const guild = new Guild(client, guildData);
	client.guilds.cache.set(guild.id, guild);
	if (client.ready) client.emit('guildCreate', guild);
}

export { handle };