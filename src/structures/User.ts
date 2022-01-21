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
import * as Images from '../constants/images';

import { DataManager } from './DataManager';
import { Message } from './Message';
import { makeAPIMessage } from '../utils/MakeAPIMessage';

import type { Client } from '../client/Client';
import type { MessageOptions } from './Channel';


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

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;

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

export { User };