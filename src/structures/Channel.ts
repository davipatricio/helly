import { DataManager } from './DataManager';

import type { Client } from '../client/Client';
import type { Guild } from './Guild';
import type { MessageEmbed, RawMessageEmbed } from './MessageEmbed';

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
	type!: ChannelType;
	id!: string;
	guild?: Guild;
	// eslint-disable-next-line no-useless-constructor
	constructor(client: Client) {
		super(client);
	}

	override parseData(data: any) {
		if (!data) return null;
	}
}

export { Channel };