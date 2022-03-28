import { APIChannel, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Channel, ChannelData } from '../structures/Channel';
import type { Guild } from '../structures/Guild';
import type { LimitedCollection } from '../utils/LimitedCollection';
import { Transformers } from '../utils/transformers/Transformers';
import { ChannelManager } from './ChannelManager';

// TODO: GuildChannelManager methods (.create, .delete, .fetch etc)

/** Manages API methods for guild {@link Channel}s */
class GuildChannelManager extends ChannelManager {
  /** The {@link Guild} that instantiated this Manager */
  guild: Guild;
  constructor(client: Client, guild: Guild) {
    super(client);
    this.guild = guild;
  }

  /** A manager of the channels belonging to this guild */
  override get cache() {
    return this.client.caches.channels.filter(c => c.guildId === this.guild.id) as LimitedCollection<string, Channel>;
  }

  /**
   * Edits a {@link Channel}
   * @param id The Id of the channel
   * @param options The options to edit the channel with
   * @param reason The reason to edit the channel
   * @example
   * ```js
   * guild.channels.edit(channel.id, { name: 'new-name', nsfw: true });
   * ```
   */
  async edit(id: string, options: ChannelData, reason = '') {
    const transformed = Transformers.channelData(options);
    const data = await this.client.rest.make(Routes.channel(id), 'Patch', transformed, { 'X-Audit-Log-Reason': reason });
    return this.updateOrSet(id, data as APIChannel, this.guild);
  }

  /**
   * Creates a {@link Channel}
   * @param options The options to create the channel
   * @param reason The reason to create the channel
   * @example
   * ```js
   * guild.channels.create({ name: 'general', type: GuildChannelType.GuildText }, 'Use this chat to talk with other members');
   * ```
   * @example
   * ```js
   * guild.channels.create({ name: 'news', type: GuildChannelType.GuildNews }, 'Use this chat to notify other members');
   * ```
   */
  async create(options: ChannelData, reason = '') {
    const transformed = Transformers.channelData(options);
    const channel = (await this.client.rest.make(Routes.guildChannels(this.guild.id), 'Post', transformed, { 'X-Audit-Log-Reason': reason })) as APIChannel;
    return this.updateOrSet(channel.id, channel, this.guild);
  }

  /**
   * Deletes a {@link Channel}
   * @param id The Id of the channel
   * @param reason The reason to delete the channel
   * @example
   * ```js
   * guild.channels.delete(channel.id, 'I am no longer needed');
   * ```
   */
  async delete(id: string, reason = '') {
    const data = (await this.client.rest.make(Routes.channel(id), 'Delete', undefined, { 'X-Audit-Log-Reason': reason })) as APIChannel;

    const channel = new Channel(this.client, data, this.guild);
    this.client.caches.channels.delete(id);
    return channel;
  }
}

export { GuildChannelManager };
