/* eslint-disable no-underscore-dangle */
import { SelectMenuBuilder as BuilderSelectMenu } from '@discordjs/builders';
import type { APISelectMenuComponent } from 'discord-api-types/v10';
import { SelectMenuOptionBuilder } from './SelectMenuOption';

/** Represents a validated select menu component */
class SelectMenuBuilder extends BuilderSelectMenu {
  #_options: SelectMenuOptionBuilder[];
  constructor(data?: Partial<APISelectMenuComponent>) {
    super(data);
    const { options } = data ?? {};
    this.#_options = options?.map(o => new SelectMenuOptionBuilder(o)) ?? [];
  }

  /** A unique string to be sent in the interaction when clicked */
  get customId() {
    return this.data.custom_id;
  }

  /** Whether this select menu is currently disabled */
  get disabled() {
    return this.data.disabled;
  }

  /** The maximum number of selections allowed */
  get maxValues() {
    return this.data.max_values;
  }

  /** The maximum number of selections allowed */
  get minValues() {
    return this.data.min_values;
  }

  get placeholder() {
    return this.data.placeholder;
  }

  /** The options within this select menu */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  override get options() {
    return this.#_options;
  }

  override set options(data) {
    this.#_options = data;
  }
}

export { SelectMenuBuilder };
