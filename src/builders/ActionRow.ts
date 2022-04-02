import { APIActionRowComponent, APIMessageActionRowComponent, APIModalActionRowComponent, ComponentType } from 'discord-api-types/v10';
import { ButtonBuilder } from './Button';
import { SelectMenuBuilder } from './SelectMenu';
import { TextInputBuilder } from './TextInput';

type RawComponentTypes = APIMessageActionRowComponent | APIModalActionRowComponent;
class ActionRowBuilder {
  /** The raw data of this action row */
  data: APIActionRowComponent<RawComponentTypes>;
  constructor(data?: APIActionRowComponent<RawComponentTypes>) {
    this.data = data ?? {
      components: [],
      type: ComponentType.ActionRow,
    };
  }

  /** The type of this component */
  get type() {
    return this.data.type;
  }

  /** The components within this action row */
  get components() {
    return (
      this.data.components
        ?.map(component => {
          switch (component.type) {
            case ComponentType.Button:
              return new ButtonBuilder(component);
            case ComponentType.SelectMenu:
              return new SelectMenuBuilder(component);
            case ComponentType.TextInput:
              return new TextInputBuilder(component);
            default:
              return component;
          }
        })
        .filter((c): c is ButtonBuilder | SelectMenuBuilder | TextInputBuilder => !!c) ?? []
    );
  }

  /**
   * Adds components to this action row
   * @param components The components to add to this action row
   */
  addComponents(...components: (RawComponentTypes | ButtonBuilder | SelectMenuBuilder | TextInputBuilder)[]) {
    this.data.components.push(
      ...components
        .map(component => {
          if (component instanceof ButtonBuilder) return component.toJSON();
          if (component instanceof SelectMenuBuilder) return component.toJSON();
          if (component instanceof TextInputBuilder) return component.toJSON();
          // Raw object components
          return component;
        })
        .filter(c => typeof c !== 'undefined'),
    );
    return this;
  }

  /**
   * Sets the components in this action row
   * @param components The components to set this row to
   */
  setComponents(...components: (RawComponentTypes | ButtonBuilder | SelectMenuBuilder | TextInputBuilder)[]) {
    this.data.components = components
      .map(component => {
        if (component instanceof ButtonBuilder) return component.toJSON();
        if (component instanceof SelectMenuBuilder) return component.toJSON();
        if (component instanceof TextInputBuilder) return component.toJSON();
        // Raw object components
        return component;
      })
      .filter(c => typeof c !== 'undefined');

    return this;
  }

  /** Returns the raw data of this action row */
  toJSON() {
    return this.data;
  }
}

export { ActionRowBuilder };
