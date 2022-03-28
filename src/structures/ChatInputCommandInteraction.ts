import { APIChatInputApplicationCommandInteraction, InteractionResponseType, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Snowflake } from '../utils';
import { MessageFlagsBitField } from '../utils/bitfield';
import { BaseStructure } from './BaseStructure';

// TODO: fetchReply() option

/** Options for deferring the reply to a {@link ChatInputCommandInteraction} */
export interface InteractionDeferReplyOptions {
  /** Whether the reply should be ephemeral */
  ephemeral?: boolean;
}

class ChatInputCommandInteraction extends BaseStructure {
  /** Raw {@link ChatInputCommandInteraction} data */
  data: APIChatInputApplicationCommandInteraction;
  /** Whether the reply to this interaction is ephemeral */
  ephemeral: boolean | undefined;
  /** Whether the reply to this interaction has been deferred */
  deferred: boolean;
  constructor(client: Client, data: APIChatInputApplicationCommandInteraction) {
    super(client);
    this.parseData(data);
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
    return Snowflake.deconstruct(this.id);
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

  /** The preferred locale from the guild this interaction was sent in */
  get guildLocale() {
    return this.data.guild_locale;
  }

  /** The interaction's token */
  get token() {
    return this.data.token;
  }

  /** The interaction's Id */
  get id() {
    return this.data.id;
  }

  /** The interaction's Id */
  get user() {
    if (!this.data.user) return undefined;
    return this.client.caches.users.get(this.data.user.id) ?? this.client.users.updateOrSet(this.data.user.id, this.data.user);
  }

  /** The locale of the user who invoked this interaction */
  get locale() {
    return this.data.locale;
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
  async deferReply(options: InteractionDeferReplyOptions = {}) {
    this.ephemeral = options.ephemeral ?? false;
    await this.client.rest.make(Routes.interactionCallback(this.id, this.token), 'Post', {
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: this.ephemeral ? MessageFlagsBitField.Flags.Ephemeral : undefined,
      },
    });
    return this;
  }

  /** @private */
  parseData(data: APIChatInputApplicationCommandInteraction, args: Partial<ChatInputCommandInteraction> = {}) {
    this.data = { ...this.data, ...data };
    if (args.ephemeral) this.ephemeral = undefined;
    if (args.deferred) this.deferred = false;
    return this;
  }
}

export { ChatInputCommandInteraction };
