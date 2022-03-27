import type { GatewayInteractionCreateDispatchData } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayInteractionCreateDispatchData) {
  if (client.ready) client.emit(Events.InteractionCreate, data);
}

export { handle };
