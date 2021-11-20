import Guild from '../structures/Guild';

import type Client from '../client/Client';

module.exports.handle = (client: Client, data: any) => {
  const guild: Guild = new Guild(client, data);
  client.guilds.cache.set(guild.id!, guild);
  if (client.ready) client.emit('guildCreate', guild);
};
