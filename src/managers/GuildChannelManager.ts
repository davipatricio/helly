import type { Client } from '../client/Client';
import type { Channel } from '../structures/Channel';
import type { Guild } from '../structures/Guild';
import type { LimitedCollection } from '../utils/LimitedCollection';
import { ChannelManager } from './ChannelManager';

// TODO: GuildChannelManager methods (.create, .delete, .fetch etc)

/** Manages API methods for guild {@link Channel}s */
class GuildChannelManager extends ChannelManager {
  /** The {@link Guild} that instantiated this Manager */
  guild: Guild;
  constructor(client: Client, guild: Guild) {
    super(client);
    this.client = client;
    this.guild = guild;
  }

  /** A manager of the channels belonging to this guild */
  override get cache() {
    return this.client.caches.channels.filter(c => c.guildId === this.guild.id) as LimitedCollection<string, Channel>;
  }
}

export { GuildChannelManager };
