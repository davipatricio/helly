import DataManager from './DataManager.js';
import User from './User.js';
import makeAPIMessage from '../utils/MakeAPIMessage.js';
import TextChannel from './TextChannel.js';
import type Guild from './Guild.js';
import type Client from '../client/Client';
import type { MessageOptions } from './Channel.js';
// eslint-disable-next-line no-duplicate-imports
import type Channel from './Channel.js';

class Message extends DataManager {
	id!: string;
	content!: string | null;
	guild!: Guild | null;
	channel!: TextChannel | Channel;
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
			const object = { content };
			const data = await this.client.requester.make(`channels/${this.channel.id}/messages`, 'POST', object);
			const message = new Message(this.client, data);
			return message;
		}

		const transformedObject = makeAPIMessage(content);
		const data = await this.client.requester.make(`channels/${this.channel.id}/messages`, 'POST', transformedObject);
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
			this.author = this.client.users.cache.get(data.user.id) ?? new User(this.client, data.user);
		}

		if (data.channel) {
			/**
			 * The channel of the message
			 * @type {?TextChannel}
			 */
			switch (data.channel.id) {
			case 0:
				this.channel = this.client.channels.cache.get(data.channel.id) ?? this.guild?.channels.cache.get(data.channel.id) ?? new TextChannel(this.client, data.channel, this.guild as Guild);
				break;
			}
		}
	}
}

export default Message;
