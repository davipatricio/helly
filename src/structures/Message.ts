import { APIMessage, MessageType } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';
import type { MessageOptions, MessagePayload, MessageReference } from './Channel';
import { Embed } from './Embed';

class Message extends BaseStructure {
  /** Raw message data */
  data: APIMessage;
  /** The id of the guild the message is in */
  guildId: string | undefined;
  /** The id of the channel the message is in */
  channelId: string;
  constructor(client: Client, data: APIMessage) {
    super(client);
    this.parseData(data);
  }

  /** The id of the application of the interaction that sent this message, if any */
  get applicationId() {
    return this.data.application_id;
  }

  /** The message's content */
  get content() {
    return this.data.content;
  }

  /** The message's id */
  get id() {
    return this.data.id;
  }

  /** The type of the message */
  get type() {
    return MessageType[this.data.type] as keyof typeof MessageType;
  }

  /** Whether or not this message was sent by Discord, not actually a user (e.g. pin notifications) */
  get system() {
    return ![MessageType.Default, MessageType.Reply, MessageType.ChatInputCommand, MessageType.ContextMenuCommand].includes(this.data.type);
  }

  /** Whether or not this message is pinned */
  get pinned() {
    return this.data.pinned;
  }

  /** Whether or not the message was Text-To-Speech */
  get tts() {
    return this.data.tts;
  }

  /** A random number or string used for checking message delivery */
  get nonce() {
    return this.data.nonce;
  }

  /* A list of embeds in the message - e.g. YouTube Player */
  get embeds() {
    return this.data.embeds.map(e => new Embed(e));
  }

  /** The {@link Guild} that the message belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId);
  }

  /** The {@link Channel} that the message belongs to */
  get channel() {
    return !this.channelId ? undefined : this.client.caches.channels.get(this.channelId);
  }

  /** The URL to jump to this message */
  get url() {
    return `https://discord.com/channels/${this.guildId ?? '@me'}/${this.channelId}/${this.id}`;
  }

  /** Message reference data */
  get messageReference(): MessageReference | undefined {
    const reference = this.data.message_reference;
    if (!reference) return undefined;

    return {
      messageId: reference.message_id,
      guildId: reference.guild_id,
      channelId: reference.channel_id,
    };
  }

  /**
   * Replies to the message
   * @param content - The content of the message
   * @example
   * ```js
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * message.reply({ embeds: [embed] })
   * ```
   * @example
   * ```js
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * message.reply({ content: 'Ping?', embeds: [embed] })
   * ```
   * @example
   * ```js
   * if (message.content === 'Hello!') message.reply('Hello!')
   * ```
   */
  async reply(content: MessageOptions) {
    const parsedContent = (content === 'string' ? { content } : content) as MessagePayload;

    parsedContent.messageReference = {
      messageId: this.id,
      channelId: this.channelId,
      guildId: this.guildId,
      failIfNotExists: this.client.options.failIfNotExists,
    };

    return this.client.channels.send(this.id, content);
  }

  /** @private */
  parseData(data: APIMessage) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    this.guildId = data.guild_id;
    this.channelId = data.channel_id;
    return this;
  }
}

export { Message };
