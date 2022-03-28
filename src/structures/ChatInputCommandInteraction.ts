import type { APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';

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

  /** The preferred locale from the guild this interaction was sent in */
  get guildLocale() {
    return this.data.guild_locale;
  }

  /** The interaction's token */
  get token() {
    return this.data.token;
  }

  /** The interaction's id */
  get id() {
    return this.data.id;
  }

  /** The interaction's id */
  get user() {
    if (!this.data.user) return undefined;
    return this.client.caches.users.get(this.data.user.id) ?? this.client.users.updateOrSet(this.data.user.id, this.data.user);
  }

  /** The locale of the user who invoked this interaction */
  get locale() {
    return this.data.locale;
  }

  /** The id of the channel the interaction is in */
  get channelId() {
    return this.data.channel_id;
  }

  /** The id of the guild the interaction is in */
  get guildId() {
    return this.data.guild_id ?? this.channel?.guild?.id;
  }

  /** The {@link Guild} that the interaction belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId) ?? this.channel?.guild;
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
