import { APIChannel, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import type { Channel, ChannelData } from '../structures/Channel';
import type { Guild } from '../structures/Guild';
import type { LimitedCollection } from '../utils/LimitedCollection';
import { Transformers } from '../utils/Transformers';
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

  async edit(id: string, options: ChannelData, reason = '') {
    const transformed = Transformers.transformChannelData(options);
    const data = await this.client.rest.make(Routes.channel(id), 'Patch', transformed, { 'X-Audit-Log-Reason': reason });
    return this.updateOrSet(id, data as APIChannel, this.guild);
  }
}

export { GuildChannelManager };
