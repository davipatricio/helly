import { APIChatInputApplicationCommandInteraction, APIModalInteractionResponseCallbackData, InteractionResponseType, MessageFlags, Routes } from 'discord-api-types/v10';
import { ModalBuilder } from '../builders';
import type { Client } from '../client/Client';
import { SnowflakeUtil } from '../utils';
import { MakeAPIMessage } from '../utils/rest';
import { BaseStructure } from './BaseStructure';
import type { ButtonInteraction } from './ButtonInteraction';
import type { MessageOptions } from './Channel';
import { ChatInputCommandOptionResolver } from './ChatInputCommandOptionResolver';
import type { Message } from './Message';
import type { ModalSubmitInteraction } from './ModalSubmitInteraction';
import type { SelectMenuInteraction } from './SelectMenuInteraction';
import { Webhook } from './Webhook';

/** Options for deferring the reply to a {@link ChatInputCommandInteraction} */
export interface InteractionDeferReplyOptions {
  /** Whether the reply should be ephemeral */
  ephemeral?: boolean;
  /** Whether to fetch the reply */
  fetchReply?: boolean;
}

class ChatInputCommandInteraction extends BaseStructure {
  /** Raw {@link ChatInputCommandInteraction} data */
  data: APIChatInputApplicationCommandInteraction;
  /** Whether the reply to this interaction is ephemeral */
  ephemeral: boolean;
  /** Whether the reply to this interaction has been deferred */
  deferred: boolean;
  /** Whether this interaction has already been replied to */
  replied: boolean;
  /** An associated interaction webhook, can be used to further interact with this interaction */
  webhook: Webhook;
  constructor(client: Client, data: APIChatInputApplicationCommandInteraction) {
    super(client);
    this.webhook = new Webhook(client, { channel_id: data.channel_id, guild_id: data.guild_id, id: data.application_id, token: data.token, application_id: data.application_id });
    this.parseData(data);
  }

  /** The invoked application command's Id */
  get commandId() {
    return this.data.data.id;
  }

  /** The invoked application command's type */
  get commandType() {
    return this.data.data.type;
  }

  /** The invoked application command's name */
  get commandName() {
    return this.data.data.name;
  }

  /** The {@link Channel} that the interaction belongs to */
  get channel() {
    return !this.channelId ? undefined : this.client.caches.channels.get(this.channelId);
  }

  /** The Id of the channel the interaction is in */
  get channelId() {
    return this.data.channel_id;
  }

  /** The time the interaction was created at */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /** The timestamp the interaction was created Id */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id);
  }

  /** The interaction's token */
  get token() {
    return this.data.token;
  }

  /** The interaction's Id */
  get id() {
    return this.data.id;
  }

  /** The interaction's type */
  get type() {
    return this.data.type;
  }

  get options() {
    return new ChatInputCommandOptionResolver(this.data.data.options ?? []);
  }

  /** The user that used this command */
  get user() {
    if (this.guildId && this.data.member) {
      return this.client.caches.users.get(this.data.member.user.id) ?? this.client.users.updateOrSet(this.data.member.user.id, this.data.member.user);
    }
    if (!this.data.user) return undefined;
    return this.client.caches.users.get(this.data.user.id) ?? this.client.users.updateOrSet(this.data.user.id, this.data.user);
  }

  /** The member that used this command */
  get member() {
    if (!this.guildId || !this.data.member) return undefined;
    return this.guild?.members.updateOrSet(this.data.member.user.id, this.data.member);
  }

  /** The locale of the user who invoked this interaction */
  get locale() {
    return this.data.locale;
  }

  /** The preferred locale from the guild this interaction was sent in */
  get guildLocale() {
    return this.data.guild_locale;
  }

  /** The Id of the guild the interaction is in */
  get guildId() {
    return this.data.guild_id ?? this.channel?.guild?.id;
  }

  /** The {@link Guild} that the interaction belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId) ?? this.channel?.guild;
  }

  /** The message to which the component was attached */
  get message() {
    if (!this.data.message) return undefined;
    return this.client.messages.updateOrSet(this.data.message.id, this.data.message);
  }

  /**
   * Defers the reply to this interaction
   * @param options Options for deferring the reply to this interaction
   * @example
   * // Defer the reply to this interaction
   * interaction.deferReply()
   * @example
   * // Defer to send an ephemeral reply later
   * interaction.deferReply({ ephemeral: true })
   */
  async deferReply(options?: InteractionDeferReplyOptions & { fetchReply: false }): Promise<undefined>;
  async deferReply(options?: InteractionDeferReplyOptions & { fetchReply: true }): Promise<Message>;
  async deferReply(options: InteractionDeferReplyOptions = {}) {
    if (this.deferred || this.replied) throw new Error('This interaction has already been replied to');
    this.ephemeral = options.ephemeral ?? false;
    await this.client.rest.make(Routes.interactionCallback(this.id, this.token), 'Post', {
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: options.ephemeral ? MessageFlags.Ephemeral : undefined,
      },
    });
    this.deferred = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  }

  /**
   * Edits the initial reply to this interaction
   * @param content The new options for the message
   * @example
   * ```js
   * // Edit the original interaction message
   * interaction.editReply(`Bot ping: ${client.ping}`)
   * ```
   * @example
   * ```js
   * // Edit the original interaction message and remove all embeds
   * interaction.editReply({ content: 'Hey there!', embeds: [] })
   * ```
   */
  async editReply(content: MessageOptions) {
    if (!this.deferred && !this.replied) throw new Error('This interaction has not been replied to');
    const message = await this.webhook.editMessage('@original', content);
    this.replied = true;
    return message;
  }

  /**
   * Replies to the interaction
   * @param content The options for the reply
   * @example
   * ```js
   * // Reply to the interaction
   * interaction.reply('Hello!')
   * ```
   * @example
   * ```js
   * // Reply to the interaction with an ephemeral reply
   * interaction.reply({ content: 'Hey there!', ephemeral: true })
   * ```
   * @example
   * ```js
   * // Reply to the interaction with an ephemeral reply and fetch the reply
   * const message = await interaction.reply({ content: 'Hey there!', ephemeral: true, fetchReply: true })
   * console.log(message.content)
   * ```
   */
  async reply(content: MessageOptions & InteractionDeferReplyOptions & { fetchReply: false }): Promise<undefined>;
  async reply(content: MessageOptions & InteractionDeferReplyOptions & { fetchReply: true }): Promise<Message>;
  async reply(content: MessageOptions & InteractionDeferReplyOptions) {
    if (this.deferred || this.replied) throw new Error('This interaction has already been replied to');
    this.ephemeral = content.ephemeral ?? false;
    const parsedMessage = MakeAPIMessage.transform(content);

    await this.client.rest.make(Routes.interactionCallback(this.id, this.token), 'Post', {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: parsedMessage,
    });
    this.replied = true;

    return content.fetchReply ? this.fetchReply() : undefined;
  }

  /**
   * Send a follow-up message to this interaction
   * @param content The options for the reply
   */
  followUp(options: MessageOptions & InteractionDeferReplyOptions) {
    if (!this.deferred && !this.replied) throw new Error('This interaction has not been replied to');
    return this.webhook.send(options);
  }

  /** Fetches the initial reply to this interaction */
  deleteReply() {
    if (this.ephemeral) throw new Error('Cannot delete an ephemeral reply');
    return this.webhook.deleteMessage('@original');
  }

  /** Fetches the initial reply to this interaction */
  fetchReply() {
    return this.webhook.fetchMessage('@original');
  }

  /**
   * Shows a modal component
   * @param modal The modal to show
   */
  async showModal(modal: ModalBuilder | APIModalInteractionResponseCallbackData) {
    await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.Modal,
        data: modal instanceof ModalBuilder ? modal.toJSON() : modal,
      },
    });
    this.replied = true;
  }

  isCommand(): this is ChatInputCommandInteraction {
    return true;
  }

  isModal(): this is ModalSubmitInteraction {
    return false;
  }

  isButton(): this is ButtonInteraction {
    return false;
  }

  isSelectMenu(): this is SelectMenuInteraction {
    return false;
  }

  override toString() {
    return `/${this.commandName}`;
  }

  /** @private */
  parseData(data: APIChatInputApplicationCommandInteraction, args: Partial<ChatInputCommandInteraction> = {}) {
    this.data = { ...this.data, ...data };
    this.ephemeral = args.ephemeral ?? false;
    this.deferred = args.deferred ?? false;
    this.replied = args.replied ?? false;
    return this;
  }
}

export { ChatInputCommandInteraction };
