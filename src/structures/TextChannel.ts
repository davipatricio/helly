import { Channel } from './Channel.js';
import { ChannelTypes } from '../constants/channelTypes.js';
import type { Guild } from './Guild.js';
import type { Client } from '../client/Client.js';

class TextChannel extends Channel {
	declare type: 'GUILD_TEXT';
	declare guild: Guild;
	declare name: string;
	constructor(client: Client, data: any, guild: Guild) {
		super(client);
		this.guild = guild;
		this.parseData(data);
	}

	override parseData(data: any) {
		if (!data) return null;

		if ('id' in data) {
			/**
			 * The channel's id
			 * @type {string}
			 */
			this.id = data.id;
		}

		if ('id' in data) {
			/**
			 * The channel's name
			 * @type {string}
			 */
			this.name = data.name;
		}

		if ('type' in data) {
			/**
			 * The type of the channel
			 * @type {string}
			 */
			this.type = ChannelTypes[data.type];
		}
	}
}

export { TextChannel };