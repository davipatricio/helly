import type { APIMessageComponentEmoji, APISelectMenuOption } from 'discord-api-types/v10';

/** Represents a validated button component */
class SelectMenuOptionBuilder {
  data: APISelectMenuOption;
  constructor(data?: APISelectMenuOption) {
    this.data = data ?? {
      label: '',
      value: '',
    };
  }

  /** Whether this option should be already-selected by default */
  get default() {
    return this.data.default;
  }

  /** An additional description of the option (max 50 chars) */
  get description() {
    return this.data.description;
  }

  /** The emoji to display to the left of the option */
  get emoji() {
    return this.data.emoji;
  }

  /** The dev-defined value of the option (max 100 chars) */
  get value() {
    return this.data.value;
  }

  /** The user-facing name of the option (max 25 chars) */
  get label() {
    return this.data.label;
  }

  /** Sets the user-facing name of the option (max 25 chars) */
  setLabel(label: string) {
    this.data.label = label;
    return this;
  }

  /** Sets the dev-defined value of the option (max 100 chars) */
  setValue(value: string) {
    this.data.value = value;
    return this;
  }

  /** Sets the emoji to display to the left of the option */
  setEmoji(emoji?: APIMessageComponentEmoji) {
    this.data.emoji = emoji;
    return this;
  }

  /** Sets the additional description of the option (max 50 chars) */
  setDescription(description?: string) {
    this.data.description = description;
    return this;
  }

  /** Sets whether this option should be already-selected by default */
  setDefault(defaultOption = true) {
    this.data.default = defaultOption;
    return this;
  }

  /** Returns the raw data of this option */
  toJSON() {
    return this.data;
  }
}

export { SelectMenuOptionBuilder };
