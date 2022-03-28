import { APIWebhook, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { CDNEndpoints } from '../constants';
import { BaseStructure } from './BaseStructure';
import type { ImageURLOptions } from './User';

class Webhook extends BaseStructure {
  /** Raw {@link User} data */
  data: APIWebhook;
  constructor(client: Client, data: APIWebhook) {
    super(client);
    this.parseData(data);
  }

  /** The webhook avatar's hash */
  get avatar() {
    return this.data.avatar;
  }

  /** The token of this webhook */
  get token() {
    return this.data.token;
  }

  /** The name of this webhook */
  get name() {
    return this.data.name;
  }

  /** The Id of this webhook */
  get id() {
    return this.data.id;
  }

  /** The Id of the guild the Webhook is in */
  get guildId() {
    return this.data.guild_id;
  }

  /** The Id of the channel the Webhook is in */
  get channelId() {
    return this.data.channel_id;
  }

  /** The {@link Guild} this Webhook belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId);
  }

  /** The {@link Channel} this Webhook belongs to */
  get channel() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.channelId);
  }

  /** The URL of this webhook */
  get url() {
    return this.data.url ?? Routes.webhook(this.id, this.token);
  }

  /** A link to the webhook's avatar */
  avatarURL({ format = 'webp', size = 1024, forceStatic = this.client.options.rest.forceStatic }: ImageURLOptions) {
    if (!this.avatar) return null;
    let finalFormat = format;
    if (!forceStatic && this.avatar.startsWith('a_')) finalFormat = 'gif';
    return CDNEndpoints.userAvatar(this.id, this.avatar, finalFormat, size);
  }

  /** @private */
  parseData(data: APIWebhook): this {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { Webhook };
