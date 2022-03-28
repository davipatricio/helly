import { APIGuild, APIMessage, APIWebhook, Routes } from 'discord-api-types/v10';
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

  /** The Id of the guild the webhook is in */
  get guildId() {
    return this.data.guild_id;
  }

  /** The Id of the channel the webhook is in */
  get channelId() {
    return this.data.channel_id;
  }

  /** The {@link Guild} this webhook belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId);
  }

  /** The {@link Channel} this webhook belongs to */
  get channel() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.channelId);
  }

  /** The URL of this webhook */
  get url() {
    return this.data.url ?? Routes.webhook(this.id, this.token);
  }

  /** The source channel of the webhook */
  get sourceChannel() {
    if (!this.data.source_channel) return undefined;
    return this.client.channels.updateOrSet(this.data.source_channel.id, this.data.source_channel);
  }

  /** The source guild of the webhook */
  get sourceGuild() {
    if (!this.data.source_guild) return undefined;
    return this.client.guilds.updateOrSet(this.data.source_guild.id, this.data.source_guild as APIGuild);
  }

  /** The owner of the webhook */
  get user() {
    if (!this.data.user) return undefined;
    return this.client.users.updateOrSet(this.data.user.id, this.data.user);
  }

  /** The type of the webhook */
  get type() {
    return this.data.type;
  }

  /** A link to the webhook's avatar */
  avatarURL({ format = 'webp', size = 1024, forceStatic = this.client.options.rest.forceStatic }: ImageURLOptions) {
    if (!this.avatar) return null;
    let finalFormat = format;
    if (!forceStatic && this.avatar.startsWith('a_')) finalFormat = 'gif';
    return CDNEndpoints.userAvatar(this.id, this.avatar, finalFormat, size);
  }

  // TODO: support thread_id param
  /** Gets a message that was sent by this webhook */
  async fetchMessage(id: string) {
    if (!this.token) throw new Error('Webhooks cannot fetch messages without a token');
    const data = (await this.client.rest.make(Routes.webhookMessage(this.id, this.token, id))) as APIMessage;
    return this.client.messages.updateOrSet(data.id, data);
  }

  /** @private */
  parseData(data: APIWebhook): this {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { Webhook };
