import type { Client } from '../client/Client';
import type { Channel } from '../structures/Channel';
import { DMChannel } from '../structures/DMChannel';
import type { Guild } from '../structures/Guild';
import { GuildChannel } from '../structures/GuildChannel';
import { TextChannel } from '../structures/TextChannel';
import { LimitedMap } from '../utils/LimitedMap';

export type AnyChannel = TextChannel | GuildChannel | DMChannel | Channel;

class ChannelManager {
	cache: LimitedMap<string, AnyChannel>;
	client: Client;
	constructor(client: Client, limit: number) {
		this.cache = new LimitedMap(limit);
		this.client = client;
	}

	/**
	 * Obtains one or more {@link GuildChannel}s from Discord, or the channel cache if they're already available.
	 * @param {string|undefined} [id] - The channel's id. If undefined, fetches all channels.
	 * @returns {Promise<Channel | Map<string, Channel>>}
	 */
	async fetch(id: string | undefined): Promise<AnyChannel> {
		const channel = await this.client.requester.make(`channels/${id}`, 'GET');
		let guild = null;
		if(channel.guild_id) guild = this.client.guilds.cache.get(channel.guild_id) ?? await this.client.guilds.fetch(channel.guild_id);

		switch (channel.type) {

		// Text channels
		case 0: {
			const parsedChannel = this.client._getChannel(channel.id)?._update(channel) ?? new TextChannel(this.client, channel, guild as Guild);
			return parsedChannel;
		}

		// DM channels
		case 1: {
			const parsedChannel = this.client._getChannel(channel.id)?._update(channel) ?? new DMChannel(this.client, channel);
			return parsedChannel;
		}

		// Unknown channels
		default: {
			const parsedChannel = this.client._getChannel(channel.id, (guild as Guild).id)?._update(channel) ?? new GuildChannel(this.client, channel, guild as Guild);
			return parsedChannel;
		}
		}
	}

}

export { ChannelManager };

