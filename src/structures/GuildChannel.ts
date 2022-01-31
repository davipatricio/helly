import { Channel } from './Channel';
import type { Client } from '../client/Client';
import { Snowflake } from '../utils/Snowflake';
import type { Guild } from './Guild';
import type { AnyChannel } from '../managers/ChannelManager';
import type { ChannelType } from '../constants/channelTypes';

export interface ChannelData {
	name?: string;
	type?: ChannelType | number;
	position?: number;
	topic: string | null;
	nsfw?: boolean;
	rate_limit_per_user?: number;
	bitrate?: number;
	user_limit?: number;
	parent_id?: string | null;
	rtc_region: string | null;
	video_quality_mode: number | null;
}

/**
 * Represents an unknown Guild channel on Discord
 */
class GuildChannel extends Channel {
	constructor(client: Client, data: any, guild?: Guild) {
		super(client, data, guild);
		this.parseData(data);
	}

	/**
	 * Changes the name of the channel
	 * @param {string} name - The new channel name
	 * @param {string} [reason] - The reason for changing the name
	 * @returns {Promise<GuildChannel>}
	 */
	async setName(name: string, reason?: string): Promise<this> {
		const data = await this.client.requester.make(`channels/${this.id}`, 'PATCH', { name }, { 'X-Audit-Log-Reason': reason });
		this.parseData(data);
		return this;
	}

	/**
	 * Deletes the channel
	 * @param {string} reason - The reason for deleting this channel
	 * @example
	 * channel.delete('I want to delete this channel');
	 * @returns {Promise<GuildChannel>}
	 */
	async delete(reason?: string): Promise<AnyChannel> {
		const data = await this.client.requester.make(`channels/${this.id}`, 'DELETE', '', { 'X-Audit-Log-Reason': reason });
		return this.client._getChannel(this.id, this.guild?.id)?._update(data) ?? new GuildChannel(this.client, data, this.guild);
	}

	/**
	 * The time the user was created at
	 * @type {Date}
	 */
	get createdAt() {
		return new Date(this.createdTimestamp);
	}

	/**
	  * Edits the channel.
	  * @param {RoleData} data The new data for the channel
	  * @param {string} [reason] Reason for editing this channel
	  * @returns {Promise<GuildChannel>}
	  */
	edit(options: ChannelData, reason?: string) {
		return this.guild.channels.edit(this.id, options, reason);
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
		super.parseData(data);

		if ('id' in data) this.id = data.id;

		/**
		 * The timestamp the user was created at
		 * @type {number}
		 */
		this.createdTimestamp = Snowflake.deconstruct(this.id);

		if ('name' in data) {
			/**
			 * The channel's name
			 * @type {string}
			 */
			this.name = data.name;
		}
	}

	override _update(data: any): GuildChannel {
		this.parseData(data);
		return this;
	}
}

export { GuildChannel };
