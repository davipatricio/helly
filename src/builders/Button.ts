import { ButtonBuilder as BuilderButton } from '@discordjs/builders';
import type { APIButtonComponentWithCustomId, APIButtonComponentWithURL, APIMessageComponentEmoji, ButtonStyle } from 'discord-api-types/v10';

/** Represents a validated button component */
class ButtonBuilder extends BuilderButton {
  /** A unique string to be sent in the interaction when clicked */
  get customId() {
    return (this.data as APIButtonComponentWithCustomId).custom_id;
  }

  /** Whether this button is currently disabled */
  get disabled() {
    return this.data.disabled;
  }

  /** Emoji for this button */
  get emoji(): APIMessageComponentEmoji | undefined {
    return this.data.emoji;
  }

  /** The text to be displayed on this button */
  get label() {
    return this.data.label;
  }

  /** The style of this button */
  get style(): ButtonStyle | undefined {
    return this.data.style;
  }

  /** The URL this button links to, if it is a Link style button */
  get url() {
    return (this.data as APIButtonComponentWithURL).url;
  }
}

export { ButtonBuilder };
