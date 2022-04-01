import {
  APIChatInputApplicationCommandInteraction,
  APIMessageComponentButtonInteraction,
  ApplicationCommandType,
  ComponentType,
  GatewayInteractionCreateDispatchData,
  InteractionType,
} from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import { ChatInputCommandInteraction } from '../../structures/ChatInputCommandInteraction';
import { ButtonInteraction } from '../../structures/ButtonInteraction';
import type { Client } from '../Client';

function handle(client: Client, data: GatewayInteractionCreateDispatchData) {
  if (client.ready) {
    let interaction: ChatInputCommandInteraction | ButtonInteraction | null = null;
    switch (data.type) {
      case InteractionType.ApplicationCommand:
        switch (data.data.type) {
          case ApplicationCommandType.ChatInput:
            interaction = new ChatInputCommandInteraction(client, data as APIChatInputApplicationCommandInteraction);
            break;
        }
        break;

      case InteractionType.MessageComponent:
        switch (data.data.component_type) {
          case ComponentType.Button:
            interaction = new ButtonInteraction(client, data as APIMessageComponentButtonInteraction);
            break;
        }
        break;
    }

    if (!interaction) return client.emit(Events.Debug, '[DEBUG] Received a interaction with an unknown type', data.type);

    return client.emit(Events.InteractionCreate, interaction);
  }
  return undefined;
}

export { handle };
