import {
  APIChatInputApplicationCommandInteraction,
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  ApplicationCommandType,
  ComponentType,
  GatewayInteractionCreateDispatchData,
  InteractionType,
} from 'discord-api-types/v10';
import { Events } from '../../constants/Events';
import { ChatInputCommandInteraction } from '../../structures/ChatInputCommandInteraction';
import { ButtonInteraction } from '../../structures/ButtonInteraction';
import type { Client } from '../Client';
import { SelectMenuInteraction } from '../../structures/SelectMenuInteraction';
import { ModalSubmitInteraction } from '../../structures/ModalSubmitInteraction';

function handle(client: Client, data: GatewayInteractionCreateDispatchData) {
  if (client.ready) {
    let interaction: ChatInputCommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction | null = null;
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
          case ComponentType.SelectMenu:
            interaction = new SelectMenuInteraction(client, data as APIMessageComponentSelectMenuInteraction);
            break;
        }
        break;

      case InteractionType.ModalSubmit:
        interaction = new ModalSubmitInteraction(client, data);
        break;
    }

    if (!interaction) return client.emit(Events.Debug, '[DEBUG] Received a interaction with an unknown type', data.type);

    return client.emit(Events.InteractionCreate, interaction);
  }
  return undefined;
}

export { handle };
