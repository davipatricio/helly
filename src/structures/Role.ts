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
	 * Changes the name of the role
	 * @param {string} name - The new name of the role
	 * @returns {Promise<Role>}
	 */
	async setName(name: string) {
		const data = await this.client.requester.make(`guilds/${this.guild.id}/roles/${this.id}`, 'PATCH', { name });
		this.parseData(data);
		return this;
	}

	/**
	 * Sets whether the role should be displayed separately in the sidebar
	 * @param {boolean} [hoist=true]
	 * @returns {Promise<Role>}
	 */
	async setHoist(hoist = true as boolean) {
		const data = await this.client.requester.make(`guilds/${this.guild.id}/roles/${this.id}`, 'PATCH', { hoist });
		this.parseData(data);
		return this;
	}

	/**
	 * Sets whether the role should be mentionable
	 * @param {boolean} [mentionable=true]
	 * @returns {Promise<Role>}
	 */
	async setMentionable(mentionable = true as boolean) {
		const data = await this.client.requester.make(`guilds/${this.guild.id}/roles/${this.id}`, 'PATCH', { mentionable });
		this.parseData(data);
		return this;
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
