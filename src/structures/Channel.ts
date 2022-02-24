import { APIChannel, APIEmbed, APITextChannel, APIVoiceChannel, ChannelType } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Snowflake } from '../utils/Snowflake';
import { BaseStructure } from './BaseStructure';
import type { Embed } from './Embed';

/** Reference data sent in a message that contains ids identifying the referenced message */
export interface MessageReference {
  /** The message's id that was referenced */
  messageId?: string | undefined;
  /** The channel's id the message was referenced */
  channelId: string;
  /** The guild's id the message was referenced */
  guildId?: string | undefined;
}

/** Represents a message to be sent to the Discord API */
export interface MessagePayload {
  content?: string;
  embeds?: (Embed | APIEmbed)[];
  messageReference?: MessageReference & { failIfNotExists?: boolean };
}

/** Base options provided when sending */
export type MessageOptions = string | MessagePayload;

/** Represents any channel on Discord */
class Channel extends BaseStructure {
  /** Raw {@link Role} data */
  data: APIChannel;
  /** The id of the guild the channel is in */
  guildId: string | undefined;
  /** The id of the category parent of this channel */
  parentId: string | undefined;
  constructor(client: Client, data: APIChannel) {
    super(client);
    this.client = client;
    this.parseData(data);
  }

  /** The time the channel was created at */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /** The timestamp the channel was created at */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id);
  }

  /** The name of the channel */
  get name() {
    return this.data.name;
  }

  /** The id of the channel */
  get id() {
    return this.data.id;
  }

  /** If the guild considers this channel NSFW */
  get nsfw() {
    return (this.data as APITextChannel).nsfw ?? false;
  }

  /** The {@link Guild} that the channel belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId);
  }

  /** The category parent of this channel */
  get parent() {
    return !this.parentId ? undefined : this.client.caches.channels.get(this.parentId);
  }

  /** The URL to the channel */
  get url() {
    return !this.guildId ? `https://discord.com/channels/@me/${this.id}` : `https://discord.com/channels/${this.guildId}/${this.id}`;
  }

  /** The {@link ChannelType | type} of the channel */
  get type() {
    return ChannelType[this.data.type] as keyof typeof ChannelType;
  }

  /** The topic of the guild channel */
  get topic() {
    return (this.data as APITextChannel).topic ?? null;
  }

  /** The maximum amount of users allowed in this channel */
  get userLimit() {
    return (this.data as APIVoiceChannel).user_limit ?? null;
  }

  /** The bitrate of this voice-based channel */
  get bitrate() {
    return (this.data as APIVoiceChannel).bitrate ?? null;
  }

  /** The rate limit per user (slowmode) for this channel in seconds */
  get rateLimitPerUser() {
    return (this.data as APITextChannel).rate_limit_per_user ?? 0;
  }

  /**
   * Sends a message to this channel
   * @param content - The content of the message
   * @example
   * ```js
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * if (channel.isText()) channel.send({ embeds: [embed] })
   * ```
   * @example
   * ```js
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * if (channel.isText()) channel.send({ content: 'Ping?', embeds: [embed] })
   * ```
   * @example
   * ```js
   * if (channel.isText()) channel.send('Hello world!')
   * ```
   */
  send(content: MessageOptions) {
    return this.client.channels.send(this.id, content);
  }

  /** Indicates whether this channel is a text channel */
  isText() {
    return this.data.type === ChannelType.GuildText;
  }

  /** Indicates whether this channel is a category */
  isCategory() {
    return this.data.type === ChannelType.GuildCategory;
  }

  /** Indicates whether this channel is a news channel */
  isNews() {
    return this.data.type === ChannelType.GuildNews;
  }

  /** Indicates whether this channel is a voice channel */
  isVoice() {
    return this.data.type === ChannelType.GuildVoice;
  }

  /** Indicates whether this channel is a stage channel */
  isStage() {
    return this.data.type === ChannelType.GuildStageVoice;
  }

  /** Indicates whether this channel is a thread in a news channel */
  isNewsThread() {
    return this.data.type === ChannelType.GuildNewsThread;
  }

  /** Indicates whether this channel is a public thread in a text channel */
  isPublicThread() {
    return this.data.type === ChannelType.GuildPublicThread;
  }

  /** Indicates whether this channel is a private thread in a text channel */
  isPrivateThread() {
    return this.data.type === ChannelType.GuildPrivateThread;
  }

  /** Indicates whether this channel can have messages */
  isTextBased() {
    return [ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildNewsThread, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread].includes(this.data.type);
  }

  /** Indicates whether this channel is voice based */
  isVoiceBased() {
    return [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(this.data.type);
  }

  /** Indicates whether this channel is a thread */
  isThreadBased() {
    return [ChannelType.GuildNewsThread, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread].includes(this.data.type);
  }

  /** @private */
  parseData(data: APIChannel) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    this.guildId = (data as APITextChannel).guild_id ?? undefined;
    this.parentId = (data as APITextChannel).parent_id ?? undefined;
    return this;
  }
}

export { Channel };
