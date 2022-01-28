/**
 * Represents a message to be sent to the API
 * @typedef {Object} MessagePayload
 * @property {string} [content] - The message content
 * @property {MessageEmbed[]|object[]} [embeds] - The embeds for the message (see [here]{@link https://discord.com/developers/docs/resources/channel#embed-object} for more details)
 * @property {MessageReference} [message_reference] - A message reference object
 */
/**
 * Represents a message to be sent to the API
 * @typedef {Object} MessageReference
 * @property {string} [message_id] - Id of the originating message
 * @property {string} [channel_id] - Id  of the originating message's channel
 * @property {string} [guild_id] - Id of the originating message's guild
 * @property {string} [fail_if_not_exists] - When sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default false
 */
export interface MessageReference {
	message_id?: string;
	channel_id?: string;
	guild_id?: string;
	fail_if_not_exists?: boolean;
}

import { Channel } from './Channel';
import type { Client } from '../client/Client';
import { Snowflake } from '../utils/Snowflake';
import type { Guild } from './Guild';
import type { MessageEmbed, RawMessageEmbed } from './MessageEmbed';
import type { AnyChannel } from '../managers/ChannelManager';

export interface MessagePayload {
	content?: string;
	embeds?: (MessageEmbed | RawMessageEmbed)[];
	reference?: MessageReference;
}
export type MessageOptions = string | MessagePayload;

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
	 * @returns {Promise<Channel>}
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
	 * @returns {Promise<Channel>}
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
	 * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object
	 * @returns {string}
	 */
	override toString(): string {
		return `<#${this.id}>`;
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;

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
