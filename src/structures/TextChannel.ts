import type { Client } from '../client/Client';
import { MessageManager } from '../managers/MessageManager';
import { makeAPIMessage } from '../utils/MakeAPIMessage';
import { Channel, MessageOptions } from './Channel';
import type { Guild } from './Guild';
import { Message } from './Message';


/**
 * Represents a text channel on Discord
 * @extends {Channel}
 */
class TextChannel extends Channel {
	declare type: 'GUILD_TEXT';
	messages: MessageManager;
	topic!: string | null;
	rateLimitPerUser!: number;
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
	 * Changes the topic of the channel
	 * @param {?string} name - The new channel topic
	 * @param {string} [reason] - The reason for changing the channel topic
	 * @returns {Promise<TextChannel>}
	 */
	async setTopic(topic = null as string | null, reason?: string): Promise<this> {
		const data = await this.client.requester.make(`channels/${this.id}`, 'PATCH', { topic }, { 'X-Audit-Log-Reason': reason });
		this.parseData(data);
		return this;
	}


	/**
	 * Changes the channel slowmode
	 * @param {number} [seconds=0] - New slowmode duration
	 * @param {string} [reason] - Reason for changing the channel slowmode
	 */
	async setRateLimitPerUser(seconds = 0 as number, reason?: string) {
		const data = await this.client.requester.make(`channels/${this.id}`, 'PATCH', { seconds }, { 'X-Audit-Log-Reason': reason });
		this.parseData(data);
		return this;
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

	/**
	 * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object
	 * @returns {string}
	 */
	override toString(): string {
		return `<#${this.id}>`;
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
		super.parseData(data);

		if ('topic' in data) {
			/**
			 * The topic of the text channel
			 * @type {?string}
			 */
			this.topic = data.topic;
		}

		if ('rate_limit_per_user' in data) {
			/**
			 * The rate limit per user (slowmode) for this channel in seconds
			 * @type {number}
			 */
			this.rateLimitPerUser = data.rate_limit_per_user;
		}
	}
}

export { TextChannel };
