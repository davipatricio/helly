import * as Images from '../constants/images';
import { DataManager } from './DataManager';
import { ImageURLOptions, User } from './User';

import type { Client } from '../client/Client';
import type { Guild } from './Guild';

/**
 * Represents a Guild Member on Discord.
 */
class GuildMember extends DataManager {
	guild: Guild;
	user!: User;
	avatar!: string;
	constructor(client: Client, memberData: any, guild: Guild) {
		super(client);
		this.guild = guild;
		this.parseData(memberData);
	}

	/**
	 * A link to the member's guild avatar if they have one. Otherwise, a link to their {@link User}#displayAvatarURL will be returned.
	 * @param {ImageURLOptions} options - {@link ImageURLOptions} Options for the Image URL
	 * @returns {string}
	 */
	displayAvatarURL({ format, size, forceStatic }: ImageURLOptions = { format: 'webp', size: 1024, forceStatic: true }) {
		if (!this.avatar) return this.user.displayAvatarURL({ format, size, forceStatic });
		if (!forceStatic && this.avatar.startsWith('a_')) format = 'gif';
		return Images.userGuildAvatarUrl(this.guild.id, this.user.id, this.avatar, format, size);
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
		this.user = this.client.users.cache.get(data.user.id) ?? this.client.users.cache.set(data.user.id, new User(this.client, data.user));

		if ('avatar' in data) {
			/**
			 * The user's guild avatar hash
			 * @type {?string}
			 */
			this.avatar = data.avatar;
		}
	}
}

export { GuildMember };