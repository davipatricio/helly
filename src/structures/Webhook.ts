import { APIWebhook, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';

class Webhook extends BaseStructure {
  /** Raw {@link User} data */
  data: APIWebhook;
  constructor(client: Client, data: APIWebhook, token?: string) {
    super(client);
    this.data.token = token ?? this.data.token;
    this.parseData(data);
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

  /** The {@link Guild} this Webhook belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId);
  }

  /** The Id of the channel the Webhook is in */
  get channelId() {
    return this.data.channel_id;
  }

  /** The {@link Channel} this Webhook belongs to */
  get channel() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.channelId);
  }

  get url() {
    return this.data.url ?? Routes.webhook(this.id, this.token);
  }

  /** @private */
  parseData(data: APIWebhook): this {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { Webhook };
