import type { APIEmbed, APIEmbedField, APIEmbedFooter } from 'discord-api-types/v10';

/** Represents an embed in a message (image/video preview, rich embed, etc.) */
class Embed {
  /** The raw data of this embed */
  data: APIEmbed;
  constructor(data: APIEmbed = {}) {
    this.data = data;
  }

  /** The title of this embed */
  get title() {
    return this.data.title;
  }

  /** The description of this embed */
  get description() {
    return this.data.description;
  }

  /** The URL of this embed */
  get url() {
    return this.data.url;
  }

  /** The timestamp of this embed */
  get timestamp() {
    return this.data.timestamp;
  }

  /** The color of this embed */
  get color() {
    return this.data.color;
  }

  /** The footer of this embed */
  get footer() {
    return this.data.footer;
  }

  /** The image of this embed */
  get image() {
    return this.data.image;
  }

  /** The video of this embed */
  get video() {
    return this.data.video;
  }

  /** The thumbnail of this embed */
  get thumbnail() {
    return this.data.thumbnail;
  }

  /** The author of this embed */
  get author() {
    return this.data.author;
  }

  /** The provider of this embed */
  get provider() {
    return this.data.provider;
  }

  /** The fields of this embed */
  get fields() {
    return this.data.fields;
  }

  /** Sets the title of this embed */
  setTitle(title: string | null) {
    this.data.title = title ?? undefined;
    return this;
  }

  /** Sets the description of this embed */
  setDescription(description: string | null) {
    this.data.description = description ?? undefined;
    return this;
  }

  /** Sets the URL of this embed */
  setURL(url: string | null) {
    this.data.url = url ?? undefined;
    return this;
  }

  /** Sets the timestamp of this embed */
  setTimestamp(timestamp: number | Date | null = Date.now()) {
    this.data.timestamp = timestamp ? new Date(timestamp).toISOString() : undefined;
    return this;
  }

  /** Sets the color of this embed */
  setColor(color: number | null) {
    this.data.color = color ?? undefined;
    return this;
  }

  /** Make the provided field the only field in this embed */
  setFooter(options: APIEmbedFooter | null) {
    if (options === null) {
      this.data.footer = undefined;
      return this;
    }
    this.data.footer = { text: options.text, icon_url: options.icon_url };
    return this;
  }

  /** Sets the image of this embed */
  setImage(url: string | null) {
    this.data.image = url ? { url } : undefined;
    return this;
  }

  /** Sets the thumbnail of this embed */
  setThumbnail(url: string | null) {
    this.data.thumbnail = url ? { url } : undefined;
    return this;
  }

  /** Adds a field to this embed */
  addField(options: APIEmbedField) {
    if (!this.data.fields) this.data.fields = [];
    this.data.fields.push({ name: options.name, value: options.value, inline: options.inline ?? false });
    return this;
  }

  /** Make the provided fields the only fields in this embed */
  setFields(options: APIEmbedField[] = []) {
    if (!Array.isArray(options)) throw new TypeError('Expected an array of fields.');
    this.data.fields = options;
    return this;
  }

  /** Transforms the embed to a {@link APIEmbed | plain object} */
  toJSON() {
    return this.data;
  }
}
export { Embed };
