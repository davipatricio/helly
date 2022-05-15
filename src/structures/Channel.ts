import { APIActionRowComponent, APIActionRowComponentTypes, APIDMChannel, APIEmbed, APIGuildChannel, APITextChannel, APIVoiceChannel, ChannelType } from 'discord-api-types/v10';
import type { ActionRowBuilder, EmbedBuilder } from '../builders';
import type { Client } from '../client/Client';
import { SnowflakeUtil } from '../utils/Snowflake';
import { BaseStructure } from './BaseStructure';
import type { Guild } from './Guild';
import type { User } from './User';

/** Reference data sent in a message that contains Ids identifying the referenced message */
export interface MessageReference {
  /** The message'sthat was referenced */
  messageId?: string | undefined;
  /** The channel'sthe message was referenced */
  channelId: string;
  /** The guild'sthe message was referenced */
  guildId?: string | undefined;
}

/** Reference data to be sent in a message */
export interface MessageReferenceSend extends MessageReference {
  failIfNotExists: boolean;
}

/** Represents a message to be sent to the Discord API */
export interface MessagePayload {
  content?: string;
  components?: (APIActionRowComponent<APIActionRowComponentTypes> | ActionRowBuilder)[];
  embeds?: (EmbedBuilder | APIEmbed)[];
  messageReference?: MessageReferenceSend;
}

export type ChannelData = Partial<Channel>;

/** Base options provided when sending */
export type MessageOptions = string | MessagePayload;

/** Represents any channel on Discord */
class Channel extends BaseStructure {
  /** Raw {@link Channel} data */
  data: APIGuildChannel<ChannelType>;
  /** Theof the guild the channel is in */
  guildId: string | undefined;
  constructor(client: Client, data: APIGuildChannel<ChannelType>, guild?: Guild) {
    super(client);
    this.client = client;
    this.parseData(data, guild);
  }

  /** The bitrate of this voice-based channel */
  get bitrate() {
    return (this.data as APIVoiceChannel).bitrate ?? null;
  }

  /** The time the channel was created at */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /** The timestamp the channel was created at */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id);
  }

  /** The name of the channel */
  get name() {
    return this.data.name ?? undefined;
  }

  /** Theof the channel */
  get id() {
    return this.data.id;
  }

  /** If the guild considers this channel NSFW */
  get nsfw() {
    return (this.data as APITextChannel).nsfw ?? false;
  }

  /** The {@link Guild} this channel belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId);
  }

  /** The category parent of this channel */
  get parent() {
    return !this.parentId ? undefined : this.client.caches.channels.get(this.parentId);
  }

  /** Theof the category parent of this channel */
  get parentId() {
    return (this.data as APITextChannel).parent_id ?? undefined;
  }

  /** The position of this {@link Guild} channel */
  get position() {
    return (this.data as APITextChannel).position ?? undefined;
  }

  /** The URL to the channel */
  get url() {
    return !this.guildId ? `https://discord.com/channels/@me/${this.id}` : `https://discord.com/channels/${this.guildId}/${this.id}`;
  }

  /** The numeric {@link ChannelType | type} of the channel */
  get type() {
    return this.data.type;
  }

  /** The topic of the guild channel */
  get topic() {
    return (this.data as APITextChannel).topic ?? null;
  }

  /** The maximum amount of users allowed in this channel */
  get userLimit() {
    return (this.data as APIVoiceChannel).user_limit ?? null;
  }

  /** The rate limit per user (slowmode) for this channel in seconds */
  get rateLimitPerUser() {
    return (this.data as APITextChannel).rate_limit_per_user ?? 0;
  }

  /** The recipient on the other end of the DM */
  get recipient(): User | null {
    const { recipients } = this.data as APIDMChannel;
    if (!recipients) return null;
    return this.client.users.updateOrSet(recipients[0].id, recipients[0]);
  }

  /** A {@link Collection} of {@link Message}s sent in this channel */
  get messages() {
    return this.client.caches.messages.filter(m => m.channelId === this.id);
  }

  /**
   * Sends a message to this channel
   * @param content The content of the message
   * @example
   * ```js
   * const { EmbedBuilder } = require('helly');
   * const embed = new EmbedBuilder().setTitle('Pong!')
   * if (channel.isText()) channel.send({ embeds: [embed] })
   * ```
   * @example
   * ```js
   * const { EmbedBuilder } = require('helly');
   * const embed = new EmbedBuilder().setTitle('Pong!')
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

  /**
   * Deletes this {@link @Guild}Channel
   * @param reason Reason for deleting this channel
   * @example
   * ```js
   * channel.delete('I am no longer needed')
   * ```
   */
  delete(reason = '') {
    if (!this.guild) throw new Error('The target channel must be in a guild.');
    return this.guild.channels.delete(this.id, reason);
  }

  /**
   * Sets a new name for the guild channel
   * @param name The new name for the guild channel
   * @param reason Reason for changing the guild channel's name
   * @example
   * ```js
   * channel.setName('server-rules')
   * ```
   * @example
   * ```js
   * channel.setName('general')
   * ```
   */
  setName(name: string, reason = '') {
    return this.guild?.channels.edit(this.id, { name }, reason);
  }

  /**
   * Sets a new position for the guild channel
   * @param position The new position for the guild channel
   * @param reason The reason for changing the position
   * @example
   * ```js
   * channel.setPosition(13)
   * ```
   * @example
   * ```js
   * channel.setPosition(3)
   * ```
   */
  setPosition(position = 0, reason = '') {
    return this.guild?.channels.edit(this.id, { position }, reason);
  }

  /**
   * Sets whether this channel is flagged as NSFW
   * @param topic Whether the channel should be considered NSFW
   * @param reason Reason for changing the channel's NSFW flag
   * @example
   * ```js
   * channel.setNSFW(true)
   * ```
   * @example
   * ```js
   * channel.setNSFW(false, 'No longer NSFW')
   * ```
   */
  setNSFW(nsfw = true, reason = '') {
    return this.guild?.channels.edit(this.id, { nsfw }, reason);
  }

  /**
   * Changes the topic of this channel
   * @param topic The new topic of this channel
   * @param reason The reason for changing the topic
   * @example
   * ```js
   * // Removes the channel topic
   * channel.setTopic(null)
   * ```
   * @example
   * ```js
   * channel.setTopic('Server rules.')
   * ```
   */
  setTopic(topic = null as string | null, reason = '') {
    return this.guild?.channels.edit(this.id, { topic }, reason);
  }

  /**
   * Sets the bitrate of the channel
   * @param bitrate The new bitrate
   * @param reason Reason for changing the channel's bitrate
   * @example
   * ```js
   * channel.setBitrate(48_000)
   * ```
   */
  setBitrate(bitrate = 64_000, reason = '') {
    return this.guild?.channels.edit(this.id, { bitrate }, reason);
  }

  /**
   * Sets the rate limit per user (slowmode) for this channel
   * @param rateLimitPerUser The rate limit per user in seconds
   * @param reason The reason for changing the rate limit
   */
  setRateLimitPerUser(rateLimitPerUser = 0, reason = '') {
    return this.guild?.channels.edit(this.id, { rateLimitPerUser }, reason);
  }

  /**
   * Changes the type of this channel
   * @param type The new type of the channel. Only conversion between `GuildText` and `GuildNews` is supported and only in guilds with the "NEWS" feature
   * @param reason The reason for changing the type
   * @example
   * ```js
   * channel.setType(ChannelType.GuildNews)
   * ```
   * @example
   * ```js
   * // set the type of the channel to Text
   * channel.setType(0, 'This was needed')
   * ```
   */
  setType(type = ChannelType.GuildText, reason = '') {
    return this.guild?.channels.edit(this.id, { type }, reason);
  }

  /** Indicates whether this channel is a text channel */
  isText() {
    return this.type === ChannelType.GuildText;
  }

  /** Indicates whether this channel is a category */
  isCategory() {
    return this.type === ChannelType.GuildCategory;
  }

  /** Indicates whether this channel is a news channel */
  isNews() {
    return this.type === ChannelType.GuildNews;
  }

  /** Indicates whether this channel is a voice channel */
  isVoice() {
    return this.type === ChannelType.GuildVoice;
  }

  /** Indicates whether this channel is a stage channel */
  isStage() {
    return this.type === ChannelType.GuildStageVoice;
  }

  /** Indicates whether this channel is a thread in a news channel */
  isNewsThread() {
    return this.type === ChannelType.GuildNewsThread;
  }

  /** Indicates whether this channel is a public thread in a text channel */
  isPublicThread() {
    return this.type === ChannelType.GuildPublicThread;
  }

  /** Indicates whether this channel is a private thread in a text channel */
  isPrivateThread() {
    return this.type === ChannelType.GuildPrivateThread;
  }

  /** Indicates whether this channel can have messages */
  isTextBased() {
    return [ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildNewsThread, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread].includes(this.type);
  }

  /** Indicates whether this channel is voice based */
  isVoiceBased() {
    return [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(this.type);
  }

  /** Indicates whether this channel is a thread */
  isThreadBased() {
    return [ChannelType.GuildNewsThread, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread].includes(this.type);
  }

  /** Returns the mention of the chanel */
  override toString() {
    return `<#${this.id}>`;
  }

  /** @private */
  parseData(data: APIGuildChannel<ChannelType>, guild?: Guild) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    this.guildId = (data as APITextChannel).guild_id ?? guild?.id ?? undefined;
    return this;
  }
}

export { Channel };
