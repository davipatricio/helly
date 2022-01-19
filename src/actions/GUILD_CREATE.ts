import { Guild } from '../structures/Guild';

import type { Client } from '../client/Client';

function handle(client: Client, guildData: any) {
	const guild = new Guild(client, guildData);
	client.guilds.cache.set(guild.id, guild);
	if (client.ready) client.emit('guildCreate', guild);
}

export { handle };