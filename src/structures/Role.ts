import type { Client } from '../client/Client';
import { Permission } from '../utils/Permission';
import { DataManager } from './DataManager';
import type { Guild } from './Guild';

/**
 * Represents a Role on Discord
 */
class Role extends DataManager {
	// String types
	name!: string;
	id!: string;
	// Boolean types
	mentionable!: boolean;
	managed!: boolean;
	// Number types
	position!: number;
	// Classes types
	permissions!: Permission;
	guild!: Guild;
	constructor(client: Client, data: any, guild: Guild) {
		super(client);
		this.guild = guild;
		this.parseData(data);
	}

	/**
	 * When concatenated with a string, this automatically returns the role's mention instead of the Role object
	 * @returns {string}
	 */
	override toString(): string {
		return `<@&${this.id}>`;
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;

		if ('id' in data) {
			/**
			 * The role's id (unique to the guild it is part of)
			 * @type {string}
			 */
			this.id = data.id;
		}

		if ('name' in data) {
			/**
			 * The name of the role
			 * @type {string}
			 */
			this.name = data.name;
		}

		if ('permissions' in data) {
			/**
			 * The role's permissions
			 * @type {Permission}
			 */
			this.permissions = new Permission().parseBitfield(data.permissions);
		}

		if ('mentionable' in data) {
			/**
			 * Whether the role is mentionable
			 * @type {boolean}
			 */
			this.mentionable = data.mentionable;
		}

		if ('managed' in data) {
			/**
			 * Whether the role is managed by a integration
			 * @type {boolean}
			 */
			this.managed = data.managed;
		}

		if ('position' in data) {
			/**
			 * The position of the role
			 * @type {number}
			 */
			this.position = data.position;
		}

		this.guild.roles.cache.set(this.id, this);
	}
}

export { Role };
