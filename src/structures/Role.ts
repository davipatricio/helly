/**
 * The data for a role.
 * @typedef {Object} RoleData
 * @property {string} [name] The name of the role
 * @property {boolean} [hoist] Whether or not the role should be hoisted
 * @property {number} [position] The position of the role
 * @property {Permission|number} [permissions] The permissions of the role
 * @property {boolean} [mentionable] Whether or not the role should be mentionable
 */

import type { Client } from '../client/Client';
import { Permission } from '../utils/Permission';
import { DataManager } from './DataManager';
import type { Guild } from './Guild';

export interface RoleData {
	name?: string;
	color?: number;
	hoist?: boolean;
	position?: number;
	permissions?: Permission | bigint;
	mentionable?: boolean;
}

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
	  * Edits the role
	  * @param {RoleData} data The new data for the role
	  * @param {string} [reason] Reason for editing this role
	  * @returns {Promise<Role>}
	  */
	edit(options: RoleData, reason?: string) {
		return this.guild.roles.edit(this.id, options, reason);
	}

	/**
	 * Deletes this role
	 * @returns {Promise<void>}
	 */
	async delete() {
		await this.client.requester.make(`guilds/${this.guild.id}/roles/${this.id}`, 'DELETE');
		return void 0;
	}

	/**
	 * Changes the name of the role
	 * @param {string} name - The new name of the role
	 * @returns {Promise<Role>}
	 */
	setName(name: string, reason = '' as string) {
		return this.guild.roles.edit(this.id, { name }, reason);
	}

	/**
	 * Sets whether the role should be displayed separately in the sidebar
	 * @param {boolean} [hoist=true]
	 * @returns {Promise<Role>}
	 */
	setHoist(hoist = true as boolean, reason = '' as string) {
		return this.guild.roles.edit(this.id, { hoist }, reason);
	}

	/**
	 * Sets whether the role should be mentionable
	 * @param {boolean} [mentionable=true]
	 * @returns {Promise<Role>}
	 */
	setMentionable(mentionable = true as boolean, reason = '' as string) {
		return this.guild.roles.edit(this.id, { mentionable }, reason);
	}

	/**
	 * Sets the position of the role
	 * @param {number} [position=1]
	 * @returns {Promise<Role>}
	 */
	setPosition(position = 1 as number, reason = '' as string) {
		return this.guild.roles.edit(this.id, { position }, reason);
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

	_update(data: any): Role {
		this.parseData(data);
		return this;
	}
}

export { Role };
