import { APIChannel, APITextChannel, APIVoiceChannel, ChannelType } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Snowflake } from '../utils/Snowflake';
import { BaseStructure } from './BaseStructure';
import type { Guild } from './Guild';

class Channel extends BaseStructure {
  /** Raw {@link Role} data */
  data: APIChannel;
  /** The guild that the channel belongs to */
  guildId: string | null;
  /** The id of the category parent of this channel */
  parentId: string | null;
  constructor(client: Client, data: APIChannel, guild: Guild | undefined) {
    super(client);
    this.client = client;
    this.parseData(data, guild);
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

  /** The guild that the channel belongs to */
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

  /** The type of the channel */
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

  isText() {
    return this.type === 'GuildText';
  }

  isCategory() {
    return this.type === 'GuildCategory';
  }

  isNews() {
    return this.type === 'GuildNews';
  }

  isVoice() {
    return this.type === 'GuildVoice';
  }

  isStage() {
    return this.type === 'GuildStageVoice';
  }

  isNewsThread() {
    return this.type === 'GuildNewsThread';
  }

  isPublicThread() {
    return this.type === 'GuildPublicThread';
  }

  isPrivateThread() {
    return this.type === 'GuildPrivateThread';
  }

  isTextBased() {
    return this.isText() || this.isNews() || this.isNewsThread() || this.isPublicThread() || this.isPrivateThread();
  }

  isVoiceBased() {
    return this.isVoice() || this.isStage();
  }

  isThreadBased() {
    return this.isNewsThread() || this.isPublicThread() || this.isPrivateThread();
  }

  /** @private */
  parseData(data: APIChannel, guild?: Guild): this {
    if (!data) return this;
    this.data = { ...this.data, ...data };
    this.guildId = guild?.id ?? null;
    this.parentId = (data as APITextChannel).parent_id ?? null;
    return this;
  }
}

export { Channel };
