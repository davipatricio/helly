import type { Client } from '../client/Client';
import { makeAPIMessage } from '../utils/MakeAPIMessage';
import { Snowflake } from '../utils/Snowflake';
import type { Channel, MessageOptions } from './Channel';
import { DataManager } from './DataManager';
import type { Guild } from './Guild';
import type { TextChannel } from './TextChannel';
import { User } from './User';

/**
 * Represents a message on Discord
 */
class Message extends DataManager {
	createdTimestamp!: number;
	createdAt!: Date;
	author!: User;
	channel!: TextChannel | Channel | null;
	content!: string | null;
	guild!: Guild | null;
	id!: string;

	// Raw IDs
	channelId!: string;
	guildId!: string;
	constructor(client: Client, userData: any) {
		super(client);
		this.parseData(userData);
	}

	/**
	 * Replies to this message
	 * @param {string|MessagePayload} content
	 * @example
	 * message.reply(`Hello, ${message.author}!`);
	 * @example
	 * message.reply({ content: `Hello, ${message.author}!` });
	 * @returns {Promise<Message>}
	 */
	async reply(content: MessageOptions) {
		if (typeof content === 'string') content = { content };

		const transformedObject = makeAPIMessage(content);
		transformedObject.message_reference = {
			message_id: this.id,
			channel_id: this.channelId,
			guild_id: this.guild?.id ?? this.guildId ?? null,
			fail_if_not_exists: this.client.options.failIfNotExists,
		};
		const data = await this.client.requester.make(`channels/${this.channelId}/messages`, 'POST', transformedObject);
		return new Message(this.client, data);
	}

	/**
	 * Deletes this message
	 * @returns Promise<void>
	 */
	delete() {
		return this.client.requester.make(`channels/${this.channelId}/messages/${this.id}`, 'DELETE');
	}

	/**
	 * When concatenated with a string, this automatically returns the message content instead of the Message object
	 * @returns {string}
	 */
	override toString() {
		return this.content ?? '';
	}

	override parseData(data: any) {
		if (!data) return null;

		if ('id' in data) {
			/**
			 * The message's id
			 * @type {string}
			 */
			this.id = data.id;
		}

		/**
		 * The timestamp the message was sent at
		 * @type {bigint}
		 */
		this.createdTimestamp = Snowflake.deconstruct(this.id);
		/**
		  * The time the message was sent at
		  * @type {Date}
		  */
		this.createdAt = new Date(this.createdTimestamp);

		if ('guild_id' in data) {
			this.guildId = data.guild_id;
			/**
			 * The guild the message was sent in
			 * @type {?Guild}
			 */
			this.guild = this.client.guilds.cache.get(this.guildId) ?? null;
		}

		if ('content' in data) {
			/**
			 * The content of the message
			 * @type {?string}
			 */
			this.content = data.content;
		} else {
			this.content ??= null;
		}

		if (data.author) {
			/**
			 * The author of the message
			 * @type {?User}
			 */
			this.author = this.client.users.cache.get(data.author.id) ?? this.client.users.cache.set(data.author.id, new User(this.client, data.author));
		}

		if (data.channel_id) {
			this.channelId = data.channel_id;
			/**
			 * The channel the message was sent in
			 * @type {?TextChannel}
			 */
			this.channel = this.client.channels.cache.get(this.channelId) ?? this.guild?.channels.cache.get(this.channelId) ?? null;
		}
	}
}

export { Message };
