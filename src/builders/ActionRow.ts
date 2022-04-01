import { APIActionRowComponent, APIMessageActionRowComponent, APITextInputComponent, ComponentType } from 'discord-api-types/v10';
import { ButtonBuilder } from './Button';
import { SelectMenuBuilder } from './SelectMenu';

type RawComponentTypes = APIMessageActionRowComponent | APITextInputComponent;
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

  /**
   * Adds components to this action row
   * @param components The components to add to this action row
   */
  addComponents(...components: (RawComponentTypes | ButtonBuilder | SelectMenuBuilder)[]) {
    this.data.components.push(
      ...components
        .map(component => {
          if (component instanceof ButtonBuilder) return component.toJSON();
          if (component instanceof SelectMenuBuilder) return component.toJSON();
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
  setComponents(...components: (RawComponentTypes | ButtonBuilder | SelectMenuBuilder)[]) {
    this.data.components = components
      .map(component => {
        if (component instanceof ButtonBuilder) return component.toJSON();
        if (component instanceof SelectMenuBuilder) return component.toJSON();
        // Raw object components
        return component;
      })
      .filter(c => typeof c !== 'undefined');

    return this;
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
          }
          return undefined;
        })
        .filter(c => typeof c !== 'undefined') ?? []
    );
  }

  /** Returns the raw data of this action row */
  toJSON() {
    return this.data;
  }
}

export { ActionRowBuilder };
