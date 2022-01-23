/**
 * An image format, here are the possible values:
 * * png
 * * jpg
 * * webp
 * * gif
 * @typedef {string} ImageFormat
*/

/**
 * An image size, here are the possible values:
 * 16, 32, 56, 96, 128, 256, 512, 600, 1024, 2048, 4096
 * @typedef {number} ImageSize
*/

/**
 * Options for Image URLs.
 * @typedef {Object} ImageURLOptions
 * @property {ImageFormat} [format='webp'] - An image format.
 * @property {ImageSize} [size=2048] - An image format.
 * @property {boolean} [forceStatic=false] - If true, the format will be as specified. If false, format may be a gif if animated.
 */
import type { Client } from '../client/Client';
import * as Images from '../constants/images';
import { makeAPIMessage } from '../utils/MakeAPIMessage';
import { Snowflake } from '../utils/Snowflake';
import type { MessageOptions } from './Channel';
import { DataManager } from './DataManager';
import { Message } from './Message';

export type ImageFormat = 'png' | 'jpg' | 'gif' | 'webp';
export type ImageSize = 16 | 32 | 56 | 64 | 96 | 128 | 256 | 300 | 512 | 600 | 1024 | 2048 | 4096;
export interface ImageURLOptions {
	format?: ImageFormat;
	size?: ImageSize;
	forceStatic?: true | false;
}

/**
 * Represents a User on Discord.
 */
class User extends DataManager {
	createdTimestamp!: number;
	createdAt!: Date;
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
	 * @example
	 * message.reply(`Hello, ${message.author}!`);
	 * @example
	 * message.reply({ content: `Hello, ${message.author}!` });
	 * @returns {Promise<Message>}
	 */
	async send(content: MessageOptions) {
		const dmId = await this.client.users.createDM(this.id);
		if (typeof content === 'string') content = { content };

		const transformedObject = makeAPIMessage(content);
		const data = await this.client.requester.make(`channels/${dmId}/messages`, 'POST', transformedObject);
		return new Message(this.client, data);
	}

	/**
	 * Display the user's avatar URL.
	 * @param {ImageURLOptions} options - Options for the Image URL
	 * @returns {string}
	 */
	displayAvatarURL({ format = 'webp', size = 1024, forceStatic = false }: ImageURLOptions) {
		if (!this.avatar) return Images.defaultUserAvatarUrl(this.discriminator);
		if (!forceStatic && this.avatar.startsWith('a_')) format = 'gif';
		return Images.userAvatarUrl(this.id, this.avatar, format, size);
	}

	/**
	 * Display the user's banner URL.
	 * @param {ImageURLOptions} options - Options for the Image URL
	 * @returns {?string}
	 */
	displayBannerURL({ format = 'webp', size = 1024, forceStatic = false }: ImageURLOptions) {
		if (!this.banner) return null;
		if (!forceStatic && this.banner.startsWith('a_')) format = 'gif';
		return Images.userBannerUrl(this.id, this.banner, format, size);
	}

	/**
	 * When concatenated with a string, this automatically returns the user's mention instead of the User object.
	 * @returns {string}
	 */
	override toString() {
		return `<@!${this.id}>`;
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;

		if ('id' in data) {
			/**
			 * The user's id
			 * @type {string}
			 */
			this.id = data.id;
		}

		/**
		 * The timestamp the user was created at
		 * @type {number}
		 */
		this.createdTimestamp = Snowflake.deconstruct(this.id);
		/**
		 * The time the user was created at
		 * @type {Date}
		 */
		this.createdAt = new Date(this.createdTimestamp);

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

export { User };
