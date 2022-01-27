/**
 * An array of enabled guild features, here are the possible values:
 * * ANIMATED_ICON
 * * BANNER
 * * COMMERCE
 * * COMMUNITY
 * * DISCOVERABLE
 * * FEATURABLE
 * * INVITE_SPLASH
 * * MEMBER_VERIFICATION_GATE_ENABLED
 * * NEWS
 * * PARTNERED
 * * PREVIEW_ENABLED
 * * VANITY_URL
 * * VERIFIED
 * * VIP_REGIONS
 * * WELCOME_SCREEN_ENABLED
 * * TICKETED_EVENTS_ENABLED
 * * MONETIZATION_ENABLED
 * * MORE_STICKERS
 * * THREE_DAY_THREAD_ARCHIVE
 * * SEVEN_DAY_THREAD_ARCHIVE
 * * PRIVATE_THREADS
 * * ROLE_ICONS
 * @typedef {string} Features
*/
import type { Client } from '../client/Client';
import { GuildChannelManager } from '../managers/GuildChannelManager';
import { GuildMemberManager } from '../managers/GuildMemberManager';
import { RoleManager } from '../managers/RoleManager';
import { Snowflake } from '../utils/Snowflake';
import { Channel } from './Channel';
import { DataManager } from './DataManager';
import { GuildMember } from './GuildMember';
import { Role } from './Role';
import { TextChannel } from './TextChannel';

export type Features = 'ANIMATED_ICON' | 'BANNER' | 'COMMERCE' | 'COMMUNITY' | 'DISCOVERABLE' | 'FEATURABLE' |
	'INVITE_SPLASH' | 'MEMBER_VERIFICATION_GATE_ENABLED' | 'NEWS' | 'PARTNERED' | 'PREVIEW_ENABLED' | 'VANITY_URL' |
	'VERIFIED' | 'VIP_REGIONS' | 'WELCOME_SCREEN_ENABLED' | 'TICKETED_EVENTS_ENABLED' | 'MONETIZATION_ENABLED' |
	'MORE_STICKERS' | 'THREE_DAY_THREAD_ARCHIVE' | 'SEVEN_DAY_THREAD_ARCHIVE' | 'PRIVATE_THREADS' | 'ROLE_ICONS'

/**
 * Represents a guild on Discord.
*/
class Guild extends DataManager {
	// String types
	name!: string;
	id!: string;
	ownerId!: string;
	features!: Features[];
	// Boolean types
	unavailable!: boolean;
	// Number types
	createdTimestamp!: number;
	// Classes types
	members!: GuildMemberManager;
	channels!: GuildChannelManager;
	roles!: RoleManager;
	constructor(client: Client, data: any) {
		super(client);
		/**
		 * The guild's members
		 * @type {GuildMemberManager}
		 */
		this.members = new GuildMemberManager(client, this.client.options.cache?.members as number, this);
		/**
		 * A manager of the channels belonging to this guild
		 * @type {GuildChannelManager}
		 */
		this.channels = new GuildChannelManager(client, this.client.options.cache?.guildChannels as number, this);
		/**
		 * A manager of the roles belonging to this guild
		 * @type {RoleManager}
		 */
		this.roles = new RoleManager(client, this.client.options.cache?.roles as number);

		this.parseData(data);
	}

	/**
	 * Fetches the owner of the guild. If the member object isn't needed, use {@link Guild#ownerId} instead.
	 * @returns {Promise<GuildMember>}
	 */
	fetchOwner() {
		return this.members.fetch(this.ownerId);
	}

	/**
	 * The time this guild was created at
	 * @type {Date}
	 */
	get createdAt() {
		return new Date(this.createdTimestamp);
	}

	/**
	 * When concatenated with a string, this automatically returns the Guild's name instead of the Guild object
	 * @returns {string}
	 */
	override toString(): string {
		return this.name;
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;

		if ('id' in data) {
			/**
			 * The guild's id
			 * @type {string}
			 */
			this.id = data.id;
		}

		if ('unavailable' in data) {
			/**
			 * Whether the guild is available to access. If it is not available, it indicates a server outage
			 * @type {boolean}
			 */
			this.unavailable = data.unavailable;
		}

		if ('name' in data) {
			/**
			 * The name of this guild
			 * @type {string}
			 */
			this.name = data.name;
		}

		// See: https://discord.com/developers/docs/topics/gateway#guild-create
		if ('members' in data) {
			for (const member of data.members) new GuildMember(this.client, member, this);
		}

		if ('channels' in data) {
			// Parse channels
			for (const channel of data.channels) {
				switch (channel.type) {

				// Text channels
				case 0: {
					new TextChannel(this.client, channel, this);
					break;
				}

				// Unknown channels
				default: {
					new Channel(this.client, channel, this);
					break;
				}
				}
			}
		}

		if ('roles' in data) {
			// Parse roles
			for (const role of data.roles) new Role(this.client, role, this);
		}

		if ('owner_id' in data) {
			/**
			 * ID of the guild owner
			 * @type {string}
			 */
			this.ownerId = data.owner_id;
		}

		/**
		 * List of Guild Features
		 * @type {Features[]}
		*/
		this.features = data.features ?? [];

		/**
		 * The timestamp this guild was created at
		 * @type {number}
		 */
		this.createdTimestamp = Snowflake.deconstruct(this.id);

		this.client.guilds.cache.set(this.id, this);
	}

	_update(data: any): Guild {
		this.parseData(data);
		return this;
	}
}

export { Guild };

