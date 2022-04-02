import { APIButtonComponent, APIButtonComponentWithCustomId, APIButtonComponentWithURL, APIMessageComponentEmoji, ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { Transformers } from '../utils/transformers';

/** Represents a validated button component */
class ButtonBuilder {
  /** The raw data of this button */
  data: APIButtonComponent;
  constructor(data?: APIButtonComponent) {
    this.data = data ?? {
      custom_id: '',
      style: ButtonStyle.Primary,
      type: ComponentType.Button,
    };
  }

  /** The type of this component */
  get type() {
    return this.data.type;
  }

  /** The custom Id of this button */
  get customId() {
    return (this.data as APIButtonComponentWithCustomId).custom_id;
  }

  /** The url of this button */
  get url() {
    return (this.data as APIButtonComponentWithURL).url;
  }

  /** The label of this button */
  get label() {
    return this.data.label;
  }

  /** Whether this button is disabled */
  get disabled() {
    return this.data.disabled;
  }

  /** The style of this button */
  get style() {
    return this.data.style;
  }

  /** The emoji of this button */
  get emoji() {
    return this.data.emoji;
  }

  /**
   * Sets the style of this button
   * @example
   * ```js
   * button.setStyle(ButtonStyle.Primary);
   * ```
   */
  setStyle(style: ButtonStyle) {
    this.data.style = style;
    return this;
  }

  /**
   * Sets the label of this button
   * @example
   * ```js
   * button.setLabel('Click here to close the channel');
   * ```
   */
  setLabel(label: string) {
    this.data.label = label;
    return this;
  }

  /**
   * Sets the disabled state of this button
   * @example
   * ```js
   * button.setDisabled(true);
   * ```
   */
  setDisabled(disabled = true) {
    this.data.disabled = disabled;
    return this;
  }

  /**
   * Sets the custom Id of this button
   * @example
   * ```js
   * button.setCustomId('first_button');
   * ```
   */
  setCustomId(customId: string) {
    (this.data as APIButtonComponentWithCustomId).custom_id = customId;
    return this;
  }

  /**
   * Sets the custom Id of this button
   * @example
   * ```js
   * button.setURL('https://helly.js.org');
   * ```
   */
  setURL(url: string) {
    (this.data as APIButtonComponentWithURL).url = url;
    return this;
  }

  /**
   * Sets the emoji to display to the left of the button
   * @example
   * ```js
   * button.setEmoji('😱');
   * ```
   * @example
   * ```js
   * button.setEmoji('<:funny:957998724506857472>');
   * ```
   */
  setEmoji(emoji?: APIMessageComponentEmoji) {
    this.data.emoji = Transformers.emoji(emoji);
    return this;
  }

  /** Returns the raw data of this button */
  toJSON() {
    return this.data;
  }
}

export { ButtonBuilder };
