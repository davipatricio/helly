/**
 * Represents a message to be sent to the API
 * @typedef {Object} MessagePayload
 * @property {string} [content] - The message content
 * @property {MessageEmbed[]|object[]} [embeds] - The embeds for the message (see [here]{@link https://discord.com/developers/docs/resources/channel#embed-object} for more details)
 * @property {MessageReference} [message_reference] - A message reference object
 */
/**
 * Represents a message reference object
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
	// String types
	id!: string;
	name!: string;
	type!: ChannelType;
	// Number types
	createdTimestamp!: number;
	// Classes types
	guild?: Guild;
	constructor(client: Client, data: any, guild?: Guild) {
		super(client);
		this.guild = guild;
		this.parseData(data);
	}

	/**
	 * Indicates whether this channel can have messages
	 * @returns {boolean}
	 */
	isTextBased(): boolean {
		return 'messages' in this;
	}

	/**
	 * Indicates whether this channel is a {@link TextChannel}
	 * @returns {boolean}
	 */
	isText() {
		return this.type === 'GUILD_TEXT';
	}

	/**
	 * Indicates whether this channel is a {@link DMChannel}
	 * @returns {boolean}
	 */
	isDM() {
		return this.type === 'DM';
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
		 * The type of the channel
		 * @type {ChannelType}
		 */
		this.type = RawChannelTypes[data.type] ?? 'UNKNOWN';

		this.guild?.channels.cache.set(this.id, this);
		this.client.channels.cache.set(this.id, this);
	}

	_update(data: any): Channel {
		this.parseData(data);
		return this;
	}
}

export { Channel };
