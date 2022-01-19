import { ChannelType } from '../constants/channelTypes';
import { Channel, MessageOptions } from './Channel';
import { Message } from './Message';
import { makeAPIMessage } from '../utils/MakeAPIMessage';

import type { Guild } from './Guild';
import type { Client } from '../client/Client';

class TextChannel extends Channel {
	declare type: 'GUILD_TEXT';
	constructor(client: Client, data: any, guild?: Guild) {
		super(client, data, guild);
		this.parseData(data);
	}

	/**
	 * Sends a message to this channel.
	 * @param {string|MessagePayload} content
	 * @returns {Promise<Message>}
	 */
	async send(content: MessageOptions) {
		if (typeof content === 'string') content = { content };
		const transformedObject = makeAPIMessage(content);
		const data = await this.client.requester.make(`channels/${this.id}/messages`, 'POST', transformedObject);
		return new Message(this.client, data);
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