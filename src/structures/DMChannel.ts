import type { Client } from '../client/Client';
import { MessageManager } from '../managers/MessageManager';
import { makeAPIMessage } from '../utils/MakeAPIMessage';
import { MessageOptions, Channel } from './Channel';
import type { Guild } from './Guild';
import { Message } from './Message';

/**
 * Represents a DM channel on Discord
 * @extends {Channel}
 */
class DMChannel extends Channel {
	// String types
	declare type: 'DM';
	// Classes types
	messages: MessageManager;
	constructor(client: Client, data: any, guild?: Guild) {
		super(client, data, guild);

		/**
		 * A manager of the messages sent to this channel
		 * @type {MessageManager}
		 */
		this.messages = new MessageManager(client, client.options.cache?.messages as number);

		this.parseData(data);
	}

	/**
	 * Sends a message to this channel
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

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
		super.parseData(data);
		this.type = 'DM';
	}

	override _update(data: any): DMChannel {
		this.parseData(data);
		return this;
	}
}

export { DMChannel };

