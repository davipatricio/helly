import { APITextInputComponent, ComponentType, TextInputStyle } from 'discord-api-types/v10';

class TextInputBuilder {
  /** The raw data of this text input */
  data: APITextInputComponent;
  constructor(data?: APITextInputComponent) {
    this.data = data ?? {
      type: ComponentType.TextInput,
      style: TextInputStyle.Paragraph,
      label: '',
      custom_id: '',
    };
  }

  /** The type of this component */
  get type() {
    return this.data.type;
  }

  /** The style of this component */
  get style() {
    return this.data.style;
  }

  /** The custom Id of this  */
  get customId() {
    return this.data.custom_id;
  }

  /** Text that appears on top of the text input field, max 80 characters */
  get label() {
    return this.data.label;
  }

  /** Maximal length of text input */
  get maxLength() {
    return this.data.max_length;
  }

  /** Minimal length of text input */
  get minLength() {
    return this.data.min_length;
  }

  /** Whether or not this text input is required or not */
  get required() {
    return this.data.required;
  }

  /** Custom placeholder text if nothing is selected, max 150 characters */
  get placeholder() {
    return this.data.placeholder;
  }

  /** The pre-filled text in the text input */
  get value() {
    return this.data.value;
  }

  /**
   * Sets the custom Id of this text inout
   * @example
   * ```js
   * textInput.setCustomId('first_input');
   * ```
   */
  setCustomId(customId: string) {
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Sets the placeholder of this text inout
   * @example
   * ```js
   * textInput.setPlaceholder('Please fill this field');
   * ```
   */
  setPlaceholder(placeholder: string) {
    this.data.placeholder = placeholder;
    return this;
  }

  /** Sets the label of this text input */
  setLabel(label: string) {
    this.data.label = label;
    return this;
  }

  /**
   * Sets the pre-filled text of this text inout
   * @example
   * ```js
   * textInput.setValue('My name is: ');
   * ```
   */
  setValue(value?: string) {
    this.data.value = value;
    return this;
  }

  /**
   * Sets if this text input is required or not
   * @example
   * ```js
   * textInput.setRequired(true);
   * ```
   */
  setRequired(required = true) {
    this.data.required = required;
    return this;
  }

  /** Sets the maximum length of this text input */
  setMaxLength(maxLength?: number) {
    this.data.max_length = maxLength;
    return this;
  }

  /** Sets the minimum length of this text input */
  setMinLength(minLength?: number) {
    this.data.min_length = minLength;
    return this;
  }

  /** Sets the style of this text input */
  setStyle(type: TextInputStyle) {
    this.data.style = type;
    return this;
  }

  /** Returns the raw data of this action row */
  toJSON() {
    return this.data;
  }
}

export { TextInputBuilder };
