import { GatewayIntentBits, GatewayReadyDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayReadyDispatchData) {
  client.api.sessionId = data.session_id;
  setTimeout(() => client.emit(Events.Ready, client), (client.options.intents as number) & GatewayIntentBits.Guilds ? 3500 : 1);
}

export { handle };
