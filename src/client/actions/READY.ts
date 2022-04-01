import { APIGuild, GatewayIntentBits, GatewayReadyDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import { ClientUser } from '../../structures/ClientUser';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayReadyDispatchData) {
  client.api.sessionId = data.session_id;
  client.id = data.user.id;

  const user = new ClientUser(client, data.user);
  client.caches.users.set(user.id, user);

  data.guilds.forEach(guild => client.guilds.updateOrSet(guild.id, guild as APIGuild));
  client.commands.fetch();

  setTimeout(
    () => {
      client.ready = true;
      client.emit(Events.Ready, client);
    },
    client.options.intents.has(GatewayIntentBits.Guilds) ? client.options.waitGuildTimeout : 0,
  ).unref();
}

export { handle };
