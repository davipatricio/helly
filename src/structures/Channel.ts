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

import type { Client } from '../client/Client';
import { ChannelType, RawChannelTypes } from '../constants/channelTypes';
import { Snowflake } from '../utils/Snowflake';
import { DataManager } from './DataManager';
import type { Guild } from './Guild';
import type { MessageEmbed, RawMessageEmbed } from './MessageEmbed';

export interface MessagePayload {
	content?: string;
	embeds?: (MessageEmbed | RawMessageEmbed)[];
	reference?: MessageReference;
}
export type MessageOptions = string | MessagePayload;

/**
 * Represents an unknown channel on Discord
 */
class Channel extends DataManager {
	createdTimestamp!: number;
	createdAt!: Date;
	id!: string;
	name!: string;
	guild?: Guild;

	type!: ChannelType;
	constructor(client: Client, data: any, guild?: Guild) {
		super(client);
		this.guild = guild;
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
	async delete(reason?: string) {
		const data = await this.client.requester.make(`channels/${this.id}`, 'DELETE', '', { 'X-Audit-Log-Reason': reason });
		return new Channel(this.client, data, this.guild);
	}

	/**
	 * Indicates whether this channel is a {@link TextChannel}
	 * @returns {boolean}
	 */
	isText() {
		return this.type === 'GUILD_TEXT';
	}

	/**
	 * Indicates whether this channel is an unknown type channel
	 * @returns {boolean}
	 */
	isUnknown() {
		return this.type === 'UNKNOWN';
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

		if ('id' in data) {
			/**
			 * The channel's id
			 * @type {string}
			 */
			this.id = data.id;
		}

		/**
		 * The timestamp the user was created at
		 * @type {number}
		 */
		this.createdTimestamp = Snowflake.deconstruct(this.id);
		/**
		 * The time the user was created at
		 * @type {Date}
		 */
		this.createdAt = new Date(this.createdTimestamp);

		if ('name' in data) {
			/**
			 * The channel's name
			 * @type {string}
			 */
			this.name = data.name;
		}

		/**
		 * The type of the channel
		 * @type {ChannelType}
		 */
		this.type = RawChannelTypes[data.type] ?? 'UNKNOWN';
	}
}

export { Channel };
