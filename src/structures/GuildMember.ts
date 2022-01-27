import type { Client } from '../client/Client';
import * as Images from '../constants/images';
import { DataManager } from './DataManager';
import type { Guild } from './Guild';
import { ImageURLOptions, User } from './User';


/**
 * Represents a Guild Member on Discord
 */
class GuildMember extends DataManager {
	// String types
	avatar!: string | null;
	nickname!: string | null;
	// Number types
	joinedTimestamp!: number | null;
	// Classes types
	guild: Guild;
	user!: User;
	constructor(client: Client, memberData: any, guild: Guild) {
		super(client);
		this.guild = guild;
		this.parseData(memberData);
	}

	/**
	 * A link to the member's guild avatar if they have one. Otherwise, a link to their {@link User#displayAvatarURL} will be returned
	 * @param {ImageURLOptions} options - {@link ImageURLOptions} Options for the Image URL
	 * @returns {string}
	 */
	displayAvatarURL({ format = 'webp', size = 1024, forceStatic = false }: ImageURLOptions) {
		if (!this.avatar) return this.user.displayAvatarURL({ format, size, forceStatic });
		if (!forceStatic && this.avatar.startsWith('a_')) format = 'gif';
		return Images.userGuildAvatarUrl(this.guild.id, this.user.id, this.avatar, format, size);
	}

	/**
	 * Fetches this GuildMember.
	 * @returns {Promise<GuildMember>}
	 */
	fetch() {
		return this.guild.members.fetch(this.user.id);
	}

	/**
	 * The member's id
	 * @type {string}
	 * @readonly
	 */
	get id() {
		return this.user.id;
	}

	/**
	 * The time this member joined the guild
	 * @type {?Date}
	 * @readonly
	 */
	get createdAt() {
		return this.joinedTimestamp && new Date(this.joinedTimestamp);
	}

	/**
	 * The nickname of this member, or their username if they don't have one
	 * @type {?string}
	 * @readonly
	 */
	get displayName() {
		return this.nickname ?? this.user.username;
	}

	/**
	 * When concatenated with a string, this automatically returns the members's mention instead of the GuildMember object
	 * @returns {string}
	 */
	override toString(): string {
		return `<@!${this.user.id}>`;
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;

		if ('user' in data) {
			/**
			 * The user that this guild member instance represents
			 * @type {?User}
			 */
			this.user = this.client.users.cache.get(data.user.id) ?? new User(this.client, data.user);
		}

		if ('avatar' in data) {
			/**
			 * The user's guild avatar hash
			 * @type {?string}
			 */
			this.avatar = data.avatar;
		}

		if ('joined_at' in data) {
			/**
			 * The timestamp the member joined the guild at
			 * @type {?number}
			 */
			this.joinedTimestamp = Date.parse(data.joined_at);
		}

		if ('nick' in data) {
			/**
			 * The nickname of this member, if they have one
			 * @type {?string}
			 */
			this.nickname = data.nick;
		}

		this.guild.members.cache.set(this.user.id, this);
	}
}

export { GuildMember };
