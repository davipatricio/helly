import { Guild } from '../structures/Guild';

import type { Client } from '../client/Client';

function handle(client: Client, guildData: any) {
	const guild = client.guilds.cache.get(guildData.id) ?? new Guild(client, guildData);
	if (client.ready) client.emit('guildDelete', guild);
	client.guilds.cache.delete(guild.id);
}

export { handle };