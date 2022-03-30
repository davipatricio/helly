import { APIGuild, APIMessage, APIWebhook, Routes } from 'discord-api-types/v10';
import type { MessageOptions } from '.';
import type { Client } from '../client/Client';
import { CDNEndpoints } from '../constants';
import { Snowflake } from '../utils';
import { MakeAPIMessage } from '../utils/rest';
import { BaseStructure } from './BaseStructure';
import type { ImageURLOptions } from './User';

class Webhook extends BaseStructure {
  /** Raw {@link Webhook} data */
  data: APIWebhook;
  constructor(client: Client, data: Partial<APIWebhook>) {
    super(client);
    this.parseData(data);
  }

  /** The webhook avatar's hash */
  get avatar() {
    if (typeof this.data.avatar === 'undefined') return undefined;
    if (this.data.avatar === null) return null;
    return this.data.avatar;
  }

  /** The time the webhook was created at */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /** The timestamp the webhook was created at */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id);
  }

  /** The {@link Channel} this webhook belongs to */
  get channel() {
    return !this.channelId ? undefined : this.client.caches.guilds.get(this.channelId);
  }

  /** The Id of the channel the webhook is in */
  get channelId() {
    if (!this.data.channel_id) return undefined;
    return this.data.channel_id;
  }

  /** The token of this webhook */
  get token() {
    return this.data.token;
  }

  /** The name of this webhook */
  get name() {
    if (!this.data.name) return undefined;
    return this.data.name;
  }

  /** The Id of this webhook */
  get id() {
    return this.data.id;
  }

  /** The Id of the guild the webhook is in */
  get guildId() {
    if (!this.data.channel_id) return undefined;
    return this.data.guild_id;
  }

  /** The {@link Guild} this webhook belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId);
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
    if (!this.data.type) return undefined;
    return this.data.type;
  }

  /** A link to the webhook's avatar */
  avatarURL({ format = 'webp', size = 1024, forceStatic = this.client.options.rest.forceStatic }: ImageURLOptions) {
    if (!this.avatar) return null;
    let finalFormat = format;
    if (!forceStatic && this.avatar.startsWith('a_')) finalFormat = 'gif';
    return CDNEndpoints.userAvatar(this.id, this.avatar, finalFormat, size);
  }

  /**
   * Sends a message with this webhook
   * @param content The content of the message
   * @example
   * ```js
   * const { EmbedBuilder } = require('helly');
   * const embed = new EmbedBuilder().setTitle('...world!')
   * webhook.send({ content: 'Hello...', embeds: [embed] })
   * ```
   * @example
   * ```js
   * webhook.send('I\'m watching you!')
   * ```
   */
  async send(content: MessageOptions) {
    if (!this.token) throw new Error('Webhooks cannot send messages without a token');
    const parsedMessage = MakeAPIMessage.transform(content);
    const data = (await this.client.rest.make(`${Routes.webhook(this.id, this.token)}?wait=true`, 'Post', parsedMessage)) as APIMessage;
    return this.client.messages.updateOrSet(data.id, data);
  }

  /**
   * Sends a raw slack message with this webhook
   * @param message The data to send
   * @example
   * ```js
   * webhook.sendSlackMessage({
   *  'username': 'Wumpus',
   *  'attachments': [{
   *    'pretext': 'this looks pretty cool',
   *    'color': '#F0F',
   *    'footer_icon': 'http://snek.s3.amazonaws.com/topSnek.png',
   *    'footer': 'Powered by sneks',
   *    'ts': Date.now() / 1_000
   *  }]
   * })
   * ```
   * @see https://api.slack.com/incoming-webhooks
   * @see https://discord.com/developers/docs/resources/webhook#execute-slackcompatible-webhook
   */
  async sendSlackMessage(message: Record<string, unknown>): Promise<boolean> {
    if (!this.token) throw new Error('Webhooks cannot send messages without a token');
    const data = (await this.client.rest.make(`${Routes.webhookPlatform(this.id, this.token, 'slack')}?wait=true`, 'Post', message)) as string;
    return data.toString() === 'ok';
  }

  // TODO: support thread_id param
  /** Gets a message that was sent by this webhook */
  async fetchMessage(id: string) {
    if (!this.token) throw new Error('Webhooks cannot fetch messages without a token');
    const data = (await this.client.rest.make(Routes.webhookMessage(this.id, this.token, id))) as APIMessage;
    return this.client.messages.updateOrSet(data.id, data);
  }

  /** @private */
  parseData(data: Partial<APIWebhook>): this {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { Webhook };
