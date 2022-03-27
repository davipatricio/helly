import { EmbedBuilder as BuilderEmbed } from '@discordjs/builders';
import type { APIEmbedField, APIEmbedImage, APIEmbedProvider, APIEmbedThumbnail, APIEmbedVideo } from 'discord-api-types/v10';

export interface EmbedBuilderAuthorData {
  /** * Name of author */
  name: string;
  /** URL of author */
  url?: string;
  /** URL of author icon (only supports http(s) and attachments) */
  iconURL?: string;
}
export interface EmbedBuilderFooterData {
  /** Footer text */
  text: string;
  /** URL of footer icon (only supports http(s) and attachments) */
  iconURL?: string;
}

/** Represents an embed in a message (image/video preview, rich embed, etc.) */
class EmbedBuilder extends BuilderEmbed {
  /** The author of this embed */
  get author() {
    if (!this.data.author) return this.data.author;
    return {
      name: this.data.author.name,
      iconURL: this.data.author.icon_url,
      url: this.data.author.url,
      proxyIconURL: this.data.author.proxy_icon_url,
    } as EmbedBuilderAuthorData;
  }

  /** The footer of this embed */
  get footer() {
    if (!this.data.footer) return this.data.footer;
    return {
      text: this.data.footer.text,
      iconURL: this.data.footer.icon_url,
      proxyIconURL: this.data.footer.proxy_icon_url,
    } as EmbedBuilderFooterData;
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

  /** The image of this embed */
  get image(): APIEmbedImage | undefined {
    return this.data.image;
  }

  /** The video of this embed */
  get video(): APIEmbedVideo | undefined {
    return this.data.video;
  }

  /** The thumbnail of this embed */
  get thumbnail(): APIEmbedThumbnail | undefined {
    return this.data.thumbnail;
  }

  /** The provider of this embed */
  get provider(): APIEmbedProvider | undefined {
    return this.data.provider;
  }

  /** The fields of this embed */
  get fields(): APIEmbedField[] | undefined {
    return this.data.fields;
  }
}
export { EmbedBuilder };
