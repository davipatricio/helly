import { APIChatInputApplicationCommandInteraction, GatewayInteractionCreateDispatchData, InteractionType } from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import { ChatInputCommandInteraction } from '../../structures/ChatInputCommandInteraction';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayInteractionCreateDispatchData) {
  if (client.ready) {
    let interaction: ChatInputCommandInteraction | null = null;
    switch (data.type) {
      case InteractionType.ApplicationCommand:
        interaction = new ChatInputCommandInteraction(client, data as APIChatInputApplicationCommandInteraction);
        break;
    }

    if (!interaction) return client.emit(Events.Debug, '[DEBUG] Received a interaction with an unknown type', data.type);

    return client.emit(Events.InteractionCreate, interaction);
  }
  return undefined;
}

export { handle };
