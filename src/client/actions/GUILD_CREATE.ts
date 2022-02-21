import type { GatewayGuildCreateDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Guild } from '../../structures/Guild';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayGuildCreateDispatchData) {
  const guild = client.guilds.updateOrSet(data.id, data);
  if (client.ready) client.emit(Events.GuildCreate, guild as Guild);
}

export { handle };
