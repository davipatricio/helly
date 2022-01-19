import { DataManager } from './DataManager';

import type { ChannelTypes, ChannelType } from '../constants/channelTypes';
import type { MessageEmbed, RawMessageEmbed } from './MessageEmbed';
import type { Client } from '../client/Client';
import type { Guild } from './Guild';

/**
 * Represents a message to be sent to the API.
 * @typedef {Object} MessagePayload
 * @property {string} [content] - The message content
 */
export interface MessagePayload {
	content?: string;
	embeds?: (MessageEmbed | RawMessageEmbed)[];
}

export type MessageOptions = string | MessagePayload;
export type ChannelType = 'GUILD_TEXT';

class Channel extends DataManager {
	id!: string;
	name!: string;
	guild?: Guild;

	type!: ChannelTypes;
	constructor(client: Client, data: any, guild?: Guild) {
		super(client);
		this.guild = guild;
		this.parseData(data);
	}

	isText() {
		return this.type === 'GUILD_TEXT';
	}

	isUnknown() {
		return this.type === 'UNKNOWN';
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
		if ('name' in data) {
			/**
			 * The channel's name
			 * @type {string}
			 */
			this.name = data.name;
		}
		if ('id' in data) {
			/**
			 * The channel's id
			 * @type {string}
			 */
			this.id = data.id;
		}
		this.type = 'UNKNOWN';
	}
}

export { Channel };