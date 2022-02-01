import type { Client } from '../client/Client';
import type { Guild } from '../structures/Guild';
import { Role, RoleData } from '../structures/Role';
import { LimitedMap } from '../utils/LimitedMap';
import { Permission } from '../utils/Permission';

/**
 * Manages API methods for Role and stores their cache.
 */
class RoleManager {
	cache: LimitedMap<string, Role>;
	client: Client;
	guild: Guild;
	constructor(client: Client, limit: number, guild: Guild) {
		this.cache = new LimitedMap(limit);
		this.client = client;
		this.guild = guild;
	}

	/**
	 * Edits a role
	 * @param {string} id - The ID of the role
	 * @param {RoleData} options - The new role data
	 * @param {string} [reason] - Reason for editing the role
	 * @returns {Promise<Role>}
	 */
	async edit(id: string, options: RoleData, reason = '' as string) {
		if (options.permissions instanceof Permission) options.permissions = options.permissions.bitfield;
		const data = await this.client.requester.make(`guilds/${this.guild.id}/roles/${id}`, 'PATCH', options, { 'X-Audit-Log-Reason': reason });
		return this.cache.get(id)?._update(data) ?? new Role(this.client, data, this.guild);
	}

	/**
	 * Deletes a role
	 * @param {string} id - The ID of the role to delete
	 * @param {string} [reason] - Reason for deleting the role
	 * @returns {Promise<void>}
	 */
	async delete(id: string, reason = '' as string) {
		await this.client.requester.make(`guilds/${this.guild.id}/roles/${id}`, 'DELETE', '', { 'X-Audit-Log-Reason': reason });
		return void 0;
	}
}

export { RoleManager };
