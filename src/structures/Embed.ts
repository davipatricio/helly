import type { APIEmbed, APIEmbedAuthor, APIEmbedField, APIEmbedFooter, APIEmbedImage, APIEmbedProvider, APIEmbedThumbnail, APIEmbedVideo } from 'discord-api-types/v10';

class Embed {
  title?: string | undefined;
  description?: string | undefined;
  url?: string | undefined;
  timestamp?: string | undefined;
  color?: number | undefined;
  footer?: APIEmbedFooter | undefined;
  image?: APIEmbedImage | undefined;
  video?: APIEmbedVideo | undefined;
  thumbnail?: APIEmbedThumbnail | undefined;
  author?: APIEmbedAuthor | undefined;
  provider?: APIEmbedProvider | undefined;
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

  setTitle(title: string) {
    this.title = title;
    return this;
  }

  setDescription(description?: string): this {
    this.description = description;
    return this;
  }

  setURL(url?: string): this {
    this.url = url;
    return this;
  }

  setTimestamp(timestamp?: number): this {
    this.timestamp = String(timestamp ?? Date.now());
    return this;
  }

  setColor(color?: number): this {
    this.color = color;
    return this;
  }

  setFooter(options?: APIEmbedFooter): this {
    if (!options) {
      this.footer = undefined;
      return this;
    }
    this.footer = { text: options.text ?? '', icon_url: options.icon_url ?? '', proxy_icon_url: options.proxy_icon_url ?? '' };
    return this;
  }

  setImage(url?: string): this {
    this.image = url ? { url } : undefined;
    return this;
  }

  setThumbnail(url?: string): this {
    this.thumbnail = url ? { url } : undefined;
    return this;
  }

  addField(options: APIEmbedField): this {
    if (!this.fields) this.fields = [];
    this.fields.push({ name: options.name, value: options.value, inline: options.inline ?? false });
    return this;
  }

  setFields(options = [] as APIEmbedField[]): this {
    if (!Array.isArray(options)) throw new TypeError('Expected an array of fields.');
    this.fields = options;
    return this;
  }

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
