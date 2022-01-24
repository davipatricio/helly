import type { Client } from '../client/Client';
import { Channel } from '../structures/Channel';
import type { Guild } from '../structures/Guild';
import { TextChannel } from '../structures/TextChannel';
import { LimitedMap } from '../utils/LimitedMap';

class GuildChannelManager {
	cache: LimitedMap<string, Channel>;
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
	 * @returns {Promise<void>}
	 */
	async delete(id: string, reason?: string) {
		if (typeof id === 'undefined') throw new Error('The provided channel id is undefined.');
		const data = await this.client.requester.make(`channels/${id}`, 'DELETE', '', { 'X-Audit-Log-Reason': reason });
		return new Channel(this.client, data);
	}

	/**
	 * Obtains one or more {@link GuildChannel}s from Discord, or the channel cache if they're already available.
	 * @param {string|undefined} [id] - The channel's id. If undefined, fetches all channels.
	 */
	async fetch(id: string | undefined): Promise<Channel | TextChannel | Map<string, TextChannel | Channel>> {
		if (!id) return this._fetchAll();
		const channel = await this.client.requester.make(`channels/${id}`, 'GET');

		switch (channel.type) {

		// Text channels
		case 0: {
			const parsedChannel = new TextChannel(this.client, channel, this.guild);
			this.guild.channels.cache.set(channel.id, parsedChannel);
			this.client.channels.cache.set(channel.id, parsedChannel);
			return parsedChannel;
		}

		// Unknown channels
		default: {
			const parsedChannel = new Channel(this.client, channel, this.guild);
			this.guild.channels.cache.set(channel.id, parsedChannel);
			this.client.channels.cache.set(channel.id, parsedChannel);
			return parsedChannel;
		}
		}
	}

	async _fetchAll() {
		const data: any[] = await this.client.requester.make(`guilds/${this.guild.id}/channels`, 'GET');
		const channels: Map<string, Channel> = new Map();

		// Parse channels
		for (const channel of data) {
			switch (channel.type) {

			// Text channels
			case 0: {
				const parsedChannel = new TextChannel(this.client, channel, this.guild);
				this.guild.channels.cache.set(channel.id, parsedChannel);
				this.client.channels.cache.set(channel.id, parsedChannel);
				channels.set(channel.id, parsedChannel);
				break;
			}

			// Unknown channels
			default: {
				const parsedChannel = new Channel(this.client, channel, this.guild);
				this.guild.channels.cache.set(channel.id, parsedChannel);
				this.client.channels.cache.set(channel.id, parsedChannel);
				channels.set(channel.id, parsedChannel);
				break;
			}
			}
		}
		return channels;
	}
}

export { GuildChannelManager };
