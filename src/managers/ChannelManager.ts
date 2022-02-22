import type { APIChannel } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Channel } from '../structures/Channel';
import type { Guild } from '../structures/Guild';

// TODO: RoleManager methods (.create, .delete, .fetch etc)

/** Manages API methods for {@link Channel}s */
class ChannelManager {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /** A manager of the roles belonging to this guild */
  get cache() {
    return this.client.caches.channels;
  }

  /**
   * Updates or caches a {@link Channel} with the provided {@link APIChannel} data
   * @private
   */
  updateOrSet(id: string, data: APIChannel, guild?: Guild) {
    const cachedChannel = this.client.caches.channels.get(id);
    if (cachedChannel) return cachedChannel.parseData(data, guild);

    const channel = new Channel(this.client, data, guild);
    this.client.caches.channels.set(id, channel);

    return channel;
  }
}

export { ChannelManager };
