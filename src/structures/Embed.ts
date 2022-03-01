import type { APIEmbed, APIEmbedAuthor, APIEmbedField, APIEmbedFooter, APIEmbedImage, APIEmbedProvider, APIEmbedThumbnail, APIEmbedVideo } from 'discord-api-types/v10';

/** Represents an embed in a message (image/video preview, rich embed, etc.) */
class Embed {
  /** The title of this embed */
  title?: string | undefined;
  /** The description of this embed */
  description?: string | undefined;
  /** The URL of this embed */
  url?: string | undefined;
  /** The timestamp of this embed */
  timestamp?: string | undefined;
  /** The hexadecimal color of the embed */
  color?: number | undefined;
  /** The footer of this embed */
  footer?: APIEmbedFooter | undefined;
  /** The image of this embed */
  image?: APIEmbedImage | undefined;
  /** The video of this embed */
  video?: APIEmbedVideo | undefined;
  /** The thumbnail of this embed */
  thumbnail?: APIEmbedThumbnail | undefined;
  /** The author of this embed */
  author?: APIEmbedAuthor | undefined;
  /** The provider of this embed */
  provider?: APIEmbedProvider | undefined;
  /** The fields of this embed */
  fields?: APIEmbedField[] | undefined;
  constructor(data = {} as APIEmbed) {
    this.title = data.title;
    this.description = data.description;
    this.url = data.url;
    this.timestamp = data.timestamp;
    this.color = data.color;
    this.footer = data.footer;
    this.image = data.image;
    this.video = data.video;
    this.thumbnail = data.thumbnail;
    this.author = data.author;
    this.provider = data.provider;
    this.fields = data.fields ?? [];
  }

  /** Sets the title of this embed */
  setTitle(title: string) {
    this.title = title;
    return this;
  }

  /** Sets the description of this embed */
  setDescription(description?: string) {
    this.description = description;
    return this;
  }

  /** Sets the URL of this embed */
  setURL(url?: string) {
    this.url = url;
    return this;
  }

  /** Sets the timestamp of this embed */
  setTimestamp(timestamp?: number) {
    this.timestamp = String(timestamp ?? Date.now());
    return this;
  }

  /** Sets the color of this embed */
  setColor(color?: number) {
    this.color = color;
    return this;
  }

  /** Make the provided field the only field in this embed */
  setFooter(options?: APIEmbedFooter) {
    if (!options) {
      this.footer = undefined;
      return this;
    }
    this.footer = { text: options.text ?? '', icon_url: options.icon_url ?? '', proxy_icon_url: options.proxy_icon_url ?? '' };
    return this;
  }

  /** Sets the image of this embed */
  setImage(url?: string) {
    this.image = url ? { url } : undefined;
    return this;
  }

  /** Sets the thumbnail of this embed */
  setThumbnail(url?: string) {
    this.thumbnail = url ? { url } : undefined;
    return this;
  }

  /** Adds a field to this embed */
  addField(options: APIEmbedField) {
    if (!this.fields) this.fields = [];
    this.fields.push({ name: options.name, value: options.value, inline: options.inline ?? false });
    return this;
  }

  /** Make the provided fields the only fields in this embed */
  setFields(options = [] as APIEmbedField[]) {
    if (!Array.isArray(options)) throw new TypeError('Expected an array of fields.');
    this.fields = options;
    return this;
  }

  /** Transforms the embed to a {@link APIEmbed | plain object} */
  toJSON(): APIEmbed {
    return {
      title: this.title as string,
      description: this.description as string,
      url: this.url as string,
      timestamp: this.timestamp as string,
      color: this.color as number,
      footer: this.footer as APIEmbedFooter,
      image: this.image as APIEmbedImage,
      video: this.video as APIEmbedVideo,
      provider: this.provider as APIEmbedProvider,
      thumbnail: this.thumbnail as APIEmbedThumbnail,
    };
  }
}
export { Embed };
