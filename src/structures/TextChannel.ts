import type { Client } from '../client/Client';
import type { AnyChannel } from '../managers/ChannelManager';
import { MessageManager } from '../managers/MessageManager';
import { makeAPIMessage } from '../utils/MakeAPIMessage';
import type { MessageOptions } from './Channel';
import type { Guild } from './Guild';
import { GuildChannel } from './GuildChannel';
import { Message } from './Message';

/**
 * Represents a text channel on Discord
 * @extends {GuildChannel}
 */
class TextChannel extends GuildChannel {
	// String types
	declare type: 'GUILD_TEXT';
	topic!: string | null;
	// Number types
	rateLimitPerUser!: number;
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
	 * Changes the topic of the channel
	 * @param {?string} name - The new channel topic
	 * @param {string} [reason] - The reason for changing the channel topic
	 * @returns {Promise<TextChannel>}
	 */
	setTopic(topic = null as string | null, reason?: string): Promise<AnyChannel> {
		return this.guild.channels.edit(this.id, { topic }, reason);
	}

	/**
	 * Changes the channel slowmode
	 * @param {number} [seconds=0] - New slowmode duration (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected
	 * @param {string} [reason] - Reason for changing the channel slowmode
	 * @returns {Promise<TextChannel>}
	 */
	setRateLimitPerUser(seconds = 0 as number, reason?: string): Promise<AnyChannel> {
		return this.guild.channels.edit(this.id, { rate_limit_per_user: seconds }, reason);
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

	override _update(data: any): TextChannel {
		this.parseData(data);
		return this;
	}
}

export { TextChannel };

