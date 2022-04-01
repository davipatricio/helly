import { APISelectMenuComponent, APISelectMenuOption, ComponentType } from 'discord-api-types/v10';
import { SelectMenuOptionBuilder } from './SelectMenuOption';

/** Represents a validated button component */
class SelectMenuBuilder {
  data: APISelectMenuComponent;
  constructor(data?: APISelectMenuComponent) {
    this.data = data ?? {
      custom_id: '',
      options: [],
      type: ComponentType.SelectMenu,
    };
  }

  /** The type of this component */
  get type() {
    return this.data.type;
  }

  /** The custom Id of this button */
  get customId() {
    return this.data.custom_id;
  }

  /** Whether this select menu is disabled */
  get disabled() {
    return this.data.disabled;
  }

  /** The maximum number of items that can be chosen; max 25 */
  get maxValues() {
    return this.data.max_values;
  }

  /** The minimum number of items that must be chosen; min 0, max 25 */
  get minValues() {
    return this.data.min_values;
  }

  /** Custom placeholder text if nothing is selected, max 150 characters */
  get placeholder() {
    return this.data.placeholder;
  }

  /** The options of this select menu */
  get options() {
    return (
      this.data.options?.map(option => {
        return new SelectMenuOptionBuilder(option);
      }) ?? []
    );
  }

  /**
   * Adds an option to this select menu
   * @example
   * ```js
   * selectMenu.addOptions(new SelectMenuOptionBuilder('option1', 'Option 1', '🍕'));
   * ```
   * @example
   * ```js
   * // Add multiple options
   * selectMenu.addOptions(
   *  new SelectMenuOptionBuilder('option1', 'Option 1', '🍕'),
   *  new SelectMenuOptionBuilder('option2', 'Option 2', '🍔')
   * )
   */
  addOptions(...options: (SelectMenuOptionBuilder | APISelectMenuOption)[]) {
    this.data.options.push(
      ...options
        .map(option => {
          if (option instanceof SelectMenuOptionBuilder) return option.toJSON();
          // Raw object components
          return option;
        })
        .filter(c => typeof c !== 'undefined'),
    );
    return this;
  }

  /**
   * Sets the options of this select menu
   * @example
   * ```js
   * selectMenu.setOptions(new SelectMenuOptionBuilder('option1', 'Option 1', '🍕'));
   * ```
   * @example
   * ```js
   * // Set multiple options
   * selectMenu.setOptions(
   *  new SelectMenuOptionBuilder('option1', 'Option 1', '🍕'),
   *  new SelectMenuOptionBuilder('option2', 'Option 2', '🍔')
   * )
   */
  setOptions(...options: (SelectMenuOptionBuilder | APISelectMenuOption)[]) {
    this.data.options = options
      .map(option => {
        if (option instanceof SelectMenuOptionBuilder) return option.toJSON();
        // Raw object components
        return option;
      })
      .filter(c => typeof c !== 'undefined');

    return this;
  }

  /**
   * Sets the custom Id of this select menu
   * @example
   * ```js
   * selectMenu.setCustomId('first_menu');
   * ```
   */
  setCustomId(id: string) {
    this.data.custom_id = id;
    return this;
  }

  /**
   * Sets the placeholder of this select menu
   * @example
   * ```js
   * selectMenu.setPlaceholder('click here to select an option');
   * ```
   */
  setPlaceholder(id?: string) {
    this.data.placeholder = id;
    return this;
  }

  /**
   * Sets the disabled state of this select menu
   * @example
   * ```js
   * selectMenu.setDisabled(true);
   * ```
   */
  setDisabled(disabled = true) {
    this.data.disabled = disabled;
    return this;
  }

  /** Sets the maximum number of items that can be chosen; max 25 */
  setMaxValues(max = 0) {
    this.data.max_values = max;
    return this;
  }

  /** Sets the minimum number of items that must be chosen; min 0, max 25 */
  setMinValues(min = 0) {
    this.data.min_values = min;
    return this;
  }

  /** Returns the raw data of this select menu */
  toJSON() {
    return this.data;
  }
}

export { SelectMenuBuilder };
