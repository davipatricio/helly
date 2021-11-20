import Guild from '../structures/Guild';

import type Client from '../client/Client';

module.exports.handle = (client: Client, data: any) => {
  const guild: Guild = client.guilds.cache.get(data.id)?._clone() ?? new Guild(client, data);
  client.guilds.cache.delete(guild.id!);
  client.emit('guildDelete', guild);
};
