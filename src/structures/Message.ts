import { DataManager } from './DataManager';
import { User } from './User';
import { makeAPIMessage } from '../utils/MakeAPIMessage';

import type { TextChannel } from './TextChannel';
import type { Guild } from './Guild';
import type { Client } from '../client/Client';
import type { MessageOptions, Channel } from './Channel';

class Message extends DataManager {
	id!: string;
	content!: string | null;
	guild!: Guild | null;
	channel!: TextChannel | Channel | null;
	channel_id!: string | null;
	author!: User;
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
		if (typeof content === 'string') {
			const object = {
				content,
				message_reference: {
					message_id: this.id,
					channel_id: this.channel_id,
					guild_id: this.guild?.id ?? null,
					fail_if_not_exists: this.client.options.failIfNotExists,
				},
			};
			const data = await this.client.requester.make(`channels/${this.channel_id}/messages`, 'POST', object);
			const message = new Message(this.client, data);
			return message;
		}

		const transformedObject = makeAPIMessage(content);
		transformedObject.message_reference = {
			message_id: this.id,
			channel_id: this.channel_id,
			guild_id: this.guild?.id ?? null,
			fail_if_not_exists: this.client.options.failIfNotExists,
		};
		const data = await this.client.requester.make(`channels/${this.channel_id}/messages`, 'POST', transformedObject);
		const message = new Message(this.client, data);
		return message;
	}


	override parseData(data: any) {
		if (!data) return null;

		if ('guild_id' in data) {
			this.guild = this.client.guilds.cache.get(data.guild_id) ?? null;
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
			this.channel = this.client.channels.cache.get(data.channel_id) ?? this.guild?.channels.cache.get(data.channel_id) ?? null;
			this.channel_id = data.channel_id;
		}
	}
}

export { Message };
