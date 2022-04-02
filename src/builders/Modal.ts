import type { APIActionRowComponent, APIModalInteractionResponseCallbackData, APITextInputComponent } from 'discord-api-types/v10';
import { ActionRowBuilder } from './ActionRow';

type RawComponentTypes = APIActionRowComponent<APITextInputComponent>;

class ModalBuilder {
  /** The raw data of this modal */
  data: APIModalInteractionResponseCallbackData;
  constructor(data?: APIModalInteractionResponseCallbackData) {
    this.data = data ?? {
      custom_id: '',
      components: [],
      title: '',
    };
  }

  /** The components within this modal */
  get components() {
    return this.data.components?.map(component => new ActionRowBuilder(component)) ?? [];
  }

  /**
   * Sets the title of this modal
   * @param title The title to set this modal to
   */
  setTitle(title: string) {
    this.data.title = title;
    return this;
  }

  /**
   * Sets the custom Id of this modal
   * @param customId The custom Id to set this modal to
   */
  setCustomId(customId: string) {
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Adds components to this modal
   * @param components The components to add to this action row
   */
  addComponents(...components: (RawComponentTypes | ActionRowBuilder)[]) {
    this.data.components.push(
      ...components
        .map(component => {
          if (component instanceof ActionRowBuilder) return component.toJSON() as unknown as RawComponentTypes;
          return new ActionRowBuilder(component).toJSON() as unknown as RawComponentTypes;
        })
        .filter(c => typeof c !== 'undefined'),
    );
    return this;
  }

  /**
   * Sets the components in this modal
   * @param components The components to set this row to
   */
  setComponents(...components: (RawComponentTypes | ActionRowBuilder)[]) {
    this.data.components = components
      .map(component => {
        if (component instanceof ActionRowBuilder) return component.toJSON() as unknown as RawComponentTypes;
        return new ActionRowBuilder(component).toJSON() as unknown as RawComponentTypes;
      })
      .filter(c => typeof c !== 'undefined');
    return this;
  }

  toJSON() {
    return this.data;
  }
}

export { ModalBuilder };
