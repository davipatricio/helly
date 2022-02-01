import type { Client } from '../client/Client';
import type { Guild } from '../structures/Guild';
import { ChannelData, GuildChannel } from '../structures/GuildChannel';
import { LimitedMap } from '../utils/LimitedMap';
import type { AnyChannel } from './ChannelManager';

/**
 * Manages API methods for GuildChannels and stores their cache.
 */
class GuildChannelManager {
	cache: LimitedMap<string, AnyChannel>;
	client: Client;
	guild: Guild;
	constructor(client: Client, limit: number, guild: Guild) {
		this.cache = new LimitedMap(limit);
		this.client = client;
		this.guild = guild;
	}

	/**
	 * Deletes the channel.
	 * @param {string} reason - The reason for deleting this channel
	 * @returns {Promise<Channel>}
	 */
	async delete(id: string, reason?: string): Promise<AnyChannel> {
		if (typeof id === 'undefined') throw new Error('The provided channel id is undefined.');
		const data = await this.client.requester.make(`channels/${id}`, 'DELETE', '', { 'X-Audit-Log-Reason': reason });
		return this.client.channels._getChannel(id, this.guild.id)?._update(data) ?? new GuildChannel(this.client, data);
	}

	async edit(id: string, options: Partial<ChannelData>, reason = '' as string): Promise<AnyChannel> {
		if (typeof id === 'undefined') throw new Error('The provided channel id is undefined.');
		const data = await this.client.requester.make(`channels/${id}`, 'PATCH', options, { 'X-Audit-Log-Reason': reason });
		return this.cache.get(id)?._update(data) ?? new GuildChannel(this.client, data, this.guild);
	}

	/**
	 * Obtains one or more {@link GuildChannel}s from Discord, or the channel cache if they're already available.
	 * @param {string|undefined} [id] - The channel's id. If undefined, fetches all channels.
	 * @returns {Promise<Channel | Map<string, Channel>>}
	 */
	async fetch(id: string | undefined): Promise<AnyChannel | Map<string, AnyChannel>> {
		if (!id) return this._fetchAll();
		const channel = await this.client.requester.make(`channels/${id}`, 'GET');
		const parsedChannel = this.client.channels._getChannel(channel.id, this.guild.id)?._update(channel) ?? this.client.channels._createChannel(channel, this.guild);
		return parsedChannel;
	}

	async _fetchAll() {
		const data: any[] = await this.client.requester.make(`guilds/${this.guild.id}/channels`, 'GET');
		const channels: Map<string, GuildChannel> = new Map();

		// Parse channels
		for (const channel of data) {
			const parsedChannel = this.client.channels._createChannel(channel, this.guild);
			channels.set(parsedChannel.id, parsedChannel as GuildChannel);
		}
		return channels;
	}
}

export { GuildChannelManager };

