import { Channel } from './Channel';
import { ChannelType } from '../constants/channelTypes';

import type { Guild } from './Guild';
import type { Client } from '../client/Client';

class TextChannel extends Channel {
	declare type: 'GUILD_TEXT';
	constructor(client: Client, data: any, guild?: Guild) {
		super(client, data, guild);
		this.parseData(data);
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
		super.parseData(data);
		/**
		 * The type of the channel
		 * @type {string}
		 */
		this.type = ChannelType[data.type];
	}
}

export { TextChannel };