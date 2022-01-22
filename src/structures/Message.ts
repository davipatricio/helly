import { DataManager } from './DataManager';
import { User } from './User';
import { makeAPIMessage } from '../utils/MakeAPIMessage';

import type { TextChannel } from './TextChannel';
import type { Guild } from './Guild';
import type { Client } from '../client/Client';
import type { Channel, MessageOptions } from './Channel';

class Message extends DataManager {
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
	 * Replies to this message.
	 * @param {string|MessagePayload} content
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
	 * Deletes this message.
	 * @returns Promise<void>
	 */
	delete() {
		return this.client.requester.make(`channels/${this.channelId}/messages/${this.id}`, 'DELETE');
	}

	/**
	 * When concatenated with a string, this automatically returns the message content instead of the Message object.
	 * @returns {string}
	 */
	override toString() {
		return this.content ?? '';
	}

	override parseData(data: any) {
		if (!data) return null;

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

		if ('id' in data) {
			/**
			 * The message's id
			 * @type {string}
			 */
			this.id = data.id;
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
