import { APIActionRowComponent, APIModalSubmitInteraction, APITextInputComponent, InteractionResponseType, MessageFlags, Routes } from 'discord-api-types/v10';
import type { MessageOptions } from '.';
import { ActionRowBuilder } from '../builders';
import type { Client } from '../client/Client';
import { SnowflakeUtil } from '../utils';
import { MakeAPIMessage } from '../utils/rest';
import { BaseStructure } from './BaseStructure';
import type { ChatInputCommandInteraction, InteractionDeferReplyOptions } from './ChatInputCommandInteraction';
import type { Message } from './Message';
import type { SelectMenuInteraction } from './SelectMenuInteraction';
import type { ButtonInteraction } from './ButtonInteraction';
import { ModalFields } from './ModalFieldResolver';
import { Webhook } from './Webhook';

class ModalSubmitInteraction extends BaseStructure {
  /** Raw {@link ModalSubmitInteraction} data */
  data: APIModalSubmitInteraction;
  /** Whether the reply to this interaction is ephemeral */
  ephemeral: boolean;
  /** Whether the reply to this interaction has been deferred */
  deferred: boolean;
  /** Whether this interaction has already been replied to */
  replied: boolean;
  /** An associated interaction webhook, can be used to further interact with this interaction */
  webhook: Webhook;
  constructor(client: Client, data: APIModalSubmitInteraction) {
    super(client);
    this.webhook = new Webhook(client, { channel_id: data.channel_id, guild_id: data.guild_id, id: data.application_id, token: data.token, application_id: data.application_id });
    this.parseData(data);
  }

  /** The custom Id of the interacted modal */
  get customId() {
    return this.data.data.custom_id;
  }

  /** The components of this modal */
  get components() {
    return this.data.data.components?.map(c => new ActionRowBuilder(c as APIActionRowComponent<APITextInputComponent>)) ?? [];
  }

  /** The fields within the modal */
  get fields() {
    return new ModalFields(this.data.data);
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

  /** The user that used this modal */
  get user() {
    if (this.data.member) {
      return this.client.caches.users.get(this.data.member.user.id) ?? this.client.users.updateOrSet(this.data.member.user.id, this.data.member.user);
    }
    if (this.data.user) return this.client.caches.users.get(this.data.user.id) ?? this.client.users.updateOrSet(this.data.user.id, this.data.user);
    return undefined;
  }

  /** The member that used this modal */
  get member() {
    if (!this.guildId || !this.data.member) return undefined;
    return this.client.caches.guilds.get(this.guildId)?.members.updateOrSet(this.data.member.user.id, this.data.member);
  }

  /** The message to which the component was attached */
  get message() {
    if (!this.data.message) return undefined;
    return this.client.messages.updateOrSet(this.data.message.id, this.data.message);
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
   * Defers the update of this interaction
   * @param options Options for deferring the update of this interaction
   * @example
   * // Defer the reply to this interaction
   * interaction.deferUpdate()
   * @example
   * // Defer to send an ephemeral reply later
   * interaction.deferUpdate({ ephemeral: true })
   */
  async deferUpdate(options?: InteractionDeferReplyOptions & { fetchReply: false }): Promise<undefined>;
  async deferUpdate(options?: InteractionDeferReplyOptions & { fetchReply: true }): Promise<Message>;
  async deferUpdate(options: InteractionDeferReplyOptions = {}) {
    if (this.deferred || this.replied) throw new Error('This interaction has already been replied to');
    await this.client.rest.make(Routes.interactionCallback(this.id, this.token), 'Post', { type: InteractionResponseType.DeferredMessageUpdate });
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
   * Updates the original message of the component on which the interaction was received on
   * @param content The options for the updated message
   * @example
   * ```js
   * // Reply to the interaction
   * interaction.update('Hello!')
   * ```
   * @example
   * ```js
   * // Reply to the interaction with an ephemeral reply
   * interaction.update({ content: 'Hey there!', ephemeral: true })
   * ```
   * @example
   * ```js
   * // Reply to the interaction with an ephemeral reply and fetch the reply
   * const message = await interaction.update({ content: 'Hey there!', ephemeral: true, fetchReply: true })
   * console.log(message.content)
   * ```
   */
  async update(content: MessageOptions & InteractionDeferReplyOptions & { fetchReply: false }): Promise<undefined>;
  async update(content: MessageOptions & InteractionDeferReplyOptions & { fetchReply: true }): Promise<Message>;
  async update(content: MessageOptions & InteractionDeferReplyOptions) {
    if (this.deferred || this.replied) throw new Error('This interaction has already been replied to');
    this.ephemeral = content.ephemeral ?? false;
    const parsedMessage = MakeAPIMessage.transform(content);

    await this.client.rest.make(Routes.interactionCallback(this.id, this.token), 'Post', {
      type: InteractionResponseType.UpdateMessage,
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

  isCommand(): this is ChatInputCommandInteraction {
    return false;
  }

  isModal(): this is ModalSubmitInteraction {
    return true;
  }

  isButton(): this is ButtonInteraction {
    return false;
  }

  isSelectMenu(): this is SelectMenuInteraction {
    return false;
  }

  /** @private */
  parseData(data: APIModalSubmitInteraction, args: Partial<ModalSubmitInteraction> = {}) {
    this.data = { ...this.data, ...data };
    this.ephemeral = args.ephemeral ?? false;
    this.deferred = args.deferred ?? false;
    this.replied = args.replied ?? false;
    return this;
  }
}

export { ModalSubmitInteraction };
