import type Client from '../client/Client.js';
import DataManager from './DataManager.js';
import type Guild from './Guild.js';
import type MessageEmbed from './MessageEmbed.js';
// eslint-disable-next-line no-duplicate-imports
import type { RawMessageEmbed } from './MessageEmbed.js';

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

export default Channel;