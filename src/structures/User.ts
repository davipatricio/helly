import type { APIUser } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { CDNEndpoints, AnimatedImageFormats, AllowedImageSizes } from '../constants/CDN';
import { SnowflakeUtil } from '../utils';
import { UserFlagsBitField } from '../utils/bitfield/UserFlagsBitField';
import { BaseStructure } from './BaseStructure';
import type { MessageOptions } from './Channel';

export interface ImageURLOptions {
  format?: AnimatedImageFormats;
  size?: AllowedImageSizes;
  forceStatic?: boolean;
}

export type UserData = Partial<User>;

class User extends BaseStructure {
  /** Raw {@link User} data */
  data: APIUser;
  constructor(client: Client, data: APIUser) {
    super(client);
    this.parseData(data);
  }

  /** The base 10 accent color of the user's banner */
  get accentColor() {
    return this.data.accent_color;
  }

  /** The user avatar's hash */
  get avatar() {
    return this.data.avatar;
  }

  /** Whether or not the user is a bot */
  get bot() {
    return Boolean(this.data.bot ?? false);
  }

  /** The user banner's hash */
  get banner() {
    return this.data.banner;
  }

  /** The time the user was created at */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /** The timestamp the user was created at */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id);
  }

  /** The DM{@link Channel} between the client's user and this user */
  get dmChannel() {
    return this.client.caches.channels.find(c => c.recipient?.id === this.id);
  }

  /** The username of the user */
  get username() {
    return this.data.username;
  }

  /** The discriminator of the user */
  get discriminator() {
    return this.data.discriminator;
  }

  /** The Discord "tag" (e.g. `Veric#2755`) for this user */
  get tag() {
    return this.username && this.discriminator ? `${this.username}#${this.discriminator}` : null;
  }

  /** The user's Id */
  get id() {
    return this.data.id;
  }

  /** Whether the user is an Official Discord System user (part of the urgent message system) */
  get system() {
    return this.data.system;
  }

  /** Whether or not the user is verified */
  get verified() {
    return this.data.verified;
  }

  get flags() {
    return new UserFlagsBitField(this.data.public_flags ?? 0);
  }

  /** A link to the user's avatar */
  avatarURL({ format = 'webp', size = 1024, forceStatic = this.client.options.rest.forceStatic }: ImageURLOptions) {
    if (!this.avatar) return null;
    let finalFormat = format;
    if (!forceStatic && this.avatar.startsWith('a_')) finalFormat = 'gif';
    return CDNEndpoints.userAvatar(this.id, this.avatar, finalFormat, size);
  }

  /** A link to the user's banner */
  bannerURL({ format = 'webp', size = 1024, forceStatic = this.client.options.rest.forceStatic }: ImageURLOptions) {
    if (!this.banner) return null;
    let finalFormat = format;
    if (!forceStatic && this.banner.startsWith('a_')) finalFormat = 'gif';
    return CDNEndpoints.userBanner(this.id, this.banner, finalFormat, size);
  }

  /** Creates a DM{@link Channel} between the client and a user */
  createDM() {
    return this.dmChannel ?? this.client.users.createDM(this.id);
  }

  /** A link to the user's avatar if they have one. Otherwise a link to their default avatar will be returned */
  displayAvatarURL({ format = 'webp', size = 1024, forceStatic = this.client.options.rest.forceStatic }: ImageURLOptions) {
    if (!this.avatar) return CDNEndpoints.defaultUserAvatar(this.discriminator);
    return this.avatarURL({ format, size, forceStatic });
  }

  /**
   * Sends a message to this user
   * @param content The content of the message
   * @example
   * ```js
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * user.send({ embeds: [embed] })
   * ```
   * @example
   * ```js
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * user.send({ content: 'Ping?', embeds: [embed] })
   * ```
   * @example
   * ```js
   * user.send('Hello world!')
   * ```
   */
  async send(content: MessageOptions) {
    const dmChannel = await this.createDM();
    return this.client.channels.send(dmChannel.id, content);
  }

  /** Fetches this user */
  fetch() {
    return this.client.users.fetch(this.id);
  }

  /** Returns the mention of the user */
  override toString() {
    return `<@!${this.id}>`;
  }

  /** @private */
  parseData(data: APIUser) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { User };
