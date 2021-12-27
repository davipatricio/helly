import DataManager from './DataManager.js';
import * as Images from '../constants/images.js';
import makeAPIMessage from '../utils/MakeAPIMessage.js';

import type Client from '../client/Client';
import type { MessageOptions } from './Channel.js';
import Message from './Message.js';

export interface ImageURLOptions {
	format: 'png' | 'jpg' | 'gif' | 'webp';
	size: 16 | 32 | 56 | 64 | 96 | 128 | 256 | 300 | 512 | 600 | 1024 | 2048 | 4096;
	dynamic: true | false;
}

/**
 * Represents a User on Discord.
 */
class User extends DataManager {
	id!: string;
	username!: string;
	discriminator!: number;
	bot!: boolean;
	tag!: string | null;
	avatar!: string | null;
	banner!: string | null;
	constructor(client: Client, userData: any) {
		super(client);
		this.parseData(userData);
	}

	/**
	 * Sends a message to this user.
	 * @param {string|MessagePayload} content
	 * @returns {Promise<Message>}
	 */
	async send(content: MessageOptions) {
		const dmId = await this.client.users.createDM(this.client, this.id);

		if (typeof content === 'string') {
			const object = { content };
			const data = await this.client.requester.make(`channels/${dmId}/messages`, 'POST', object);
			const message = new Message(this.client, data);
			return message;
		}

		const transformedObject = makeAPIMessage(content);
		const data = await this.client.requester.make(`channels/${dmId}/messages`, 'POST', transformedObject);
		const message = new Message(this.client, data);
		return message;
	}

	/**
	 * Options for images
	 * @typedef {Object} ImageURLOptions
	 * @property {string} [format="png"] - The image format.
	 * @property {number} [size=1024] - The image size.
	 * @property {boolean} [dynamic=false] - If true, the format will dynamically change to 'gif' for animated images.
	 */

	/**
	 * Display the user's avatar URL.
	 * @param {ImageURLOptions} options - Options for the Image URL
	 * @returns {string}
	 */
	displayAvatarURL({ format, size, dynamic }: ImageURLOptions = { format: 'png', size: 1024, dynamic: false }) {
		if (!this.avatar) return Images.defaultUserAvatarUrl(this.discriminator);
		if (dynamic && this.avatar.startsWith('a_')) format = 'gif';
		return Images.userAvatarUrl(this.id, this.avatar, format, size);
	}

	/**
	 * Display the user's banner URL.
	 * @param {ImageURLOptions} options - Options for the Image URL
	 * @returns {?string}
	 */
	displayBannerURL({ format, size, dynamic }: ImageURLOptions = { format: 'png', size: 1024, dynamic: false }) {
		if (!this.banner) return null;
		if (dynamic && this.banner.startsWith('a_')) format = 'gif';
		return Images.userBannerUrl(this.id, this.banner, format, size);
	}

	override parseData(data: any) {
		if (!data) return null;

		if ('id' in data) {
			/**
			 * The user's id
			 * @type {string}
			 */
			this.id = data.id;
		}

		if ('username' in data) {
			/**
			 * The user's username
			 * @type {string}
			 */
			this.username = data.username;
		}

		if ('discriminator' in data) {
			/**
			 * The user's discriminator
			 * @type {string}
			 */
			this.discriminator = data.discriminator;
		}

		if ('bot' in data) {
			/**
			 * Whether the user is a bot
			 * @type {boolean}
			 */
			this.bot = data.bot;
		}

		if ('avatar' in data) {
			/**
			 * The user's avatar hash
			 * @type {?string}
			 */
			this.avatar = data.avatar;
		}

		if ('banner' in data) {
			/**
			 * The user's banner hash
			 * @type {?string}
			 */
			this.banner = data.banner;
		}

		/**
		 * The Discord "tag" (e.g. Veric#2799) for this user
		 * @type {?string}
		 */
		this.tag = this.username && this.discriminator ? `${this.username}#${this.discriminator}` : null;
	}
}

export default User;