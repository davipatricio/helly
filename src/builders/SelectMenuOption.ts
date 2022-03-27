import { SelectMenuOptionBuilder as BuilderSelectMenuOption } from '@discordjs/builders';
import type { APIMessageComponentEmoji } from 'discord-api-types/v10';

/** Represents a validated option within a select menu component */
class SelectMenuOptionBuilder extends BuilderSelectMenuOption {
  /** Whether this option is displayed as the default selection */
  get default() {
    return this.data.default;
  }

  /** Optional description to show for this option */
  get description() {
    return this.data.description;
  }

  /** The value to be sent for this option */
  get value() {
    return this.data.value;
  }

  /** The text to be displayed on this option */
  get label() {
    return this.data.label;
  }

  /** Emoji to display for this optionn */
  get emoji(): APIMessageComponentEmoji | undefined {
    return this.data.emoji;
  }
}

export { SelectMenuOptionBuilder };
