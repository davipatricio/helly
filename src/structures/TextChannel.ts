import type { Client } from '../client/Client';
import { makeAPIMessage } from '../utils/MakeAPIMessage';
import { Channel, MessageOptions } from './Channel';
import type { Guild } from './Guild';
import { Message } from './Message';


/**
 * Represents a text channel on Discord.
 * @extends {Channel}
 */
class TextChannel extends Channel {
	declare type: 'GUILD_TEXT';
	constructor(client: Client, data: any, guild?: Guild) {
		super(client, data, guild);
		this.parseData(data);
	}

	/**
	 * Sends a message to this channel.
	 * @param {string|MessagePayload} content
	 * @example
	 * message.reply(`Hello, ${message.author}!`);
	 * @example
	 * message.reply({ content: `Hello, ${message.author}!` });
	 * @returns {Promise<Message>}
	 */
	async send(content: MessageOptions) {
		if (typeof content === 'string') content = { content };
		const transformedObject = makeAPIMessage(content);
		const data = await this.client.requester.make(`channels/${this.id}/messages`, 'POST', transformedObject);
		return new Message(this.client, data);
	}

	/**
	 * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object.
	 * @returns {string}
	 */
	override toString() {
		return `<#${this.id}>`;
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
		super.parseData(data);
	}
}

export { TextChannel };
