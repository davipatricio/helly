import { DataManager } from './DataManager';
import { GuildMemberManager } from '../managers/GuildMemberManager';
import { GuildMember } from './GuildMember';
import { User } from './User';
import { GuildChannelManager } from '../managers/GuildChannelManager';
import { TextChannel } from './TextChannel';
import { Channel } from './Channel';

import type { Client } from '../client/Client';

export type Features = 'ANIMATED_ICON' | 'BANNER' | 'COMMERCE' | 'COMMUNITY' | 'DISCOVERABLE' | 'FEATURABLE' |
	'INVITE_SPLASH' | 'MEMBER_VERIFICATION_GATE_ENABLED' | 'NEWS' | 'PARTNERED' | 'PREVIEW_ENABLED' | 'VANITY_URL' |
	'VERIFIED' | 'VIP_REGIONS' | 'WELCOME_SCREEN_ENABLED' | 'TICKETED_EVENTS_ENABLED' | 'MONETIZATION_ENABLED' |
	'MORE_STICKERS' | 'THREE_DAY_THREAD_ARCHIVE' | 'SEVEN_DAY_THREAD_ARCHIVE' | 'PRIVATE_THREADS' | 'ROLE_ICONS'

/**
 * Represents a guild on Discord.
*/
class Guild extends DataManager {
	name!: string;
	id!: string;
	features!: Features[];
	unavailable!: boolean;
	members!: GuildMemberManager;
	channels!: GuildChannelManager;
	constructor(client: Client, data: any) {
		super(client);
		/**
		 * The guild's members
		 * @type {GuildMemberManager}
		 */
		this.members = new GuildMemberManager(client, this.client.options.cache?.members as number);
		/**
		 * A manager of the channels belonging to this guild
		 * @type {GuildChannelManager}
		 */
		this.channels = new GuildChannelManager(client, this.client.options.cache?.guildChannels as number);

		this.parseData(data);
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
		/* If your bot does not have the GUILD_PRESENCES Gateway Intent, or if the guild has over 75k members, members and presences
		returned in this event will only contain your bot and users in voice channels. */
		if ('members' in data) {
			for (const member of data.members) {
				this.client.users.cache.set(member.user.id, new User(this.client, member.user));
				this.members.cache.set(member.user.id, new GuildMember(this.client, member, this));
			}
		}

		if ('channels' in data) {
			for (const channel of data.channels) {
				switch (channel.type) {

				// Text channels
				case 0: {
					const parsedChannel = new TextChannel(this.client, channel, this);
					this.channels.cache.set(channel.id, parsedChannel);
					this.client.channels.cache.set(channel.id, parsedChannel);
					break;
				}

				// Unknown channels
				default: {
					const parsedChannel = new Channel(this.client, channel, this);
					this.channels.cache.set(channel.id, parsedChannel);
					this.client.channels.cache.set(channel.id, parsedChannel);
					break;
				}
				}
			}
		}

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
		/**
		 * List of Guild Features
		 * @type {Features[]}
		*/
		this.features = data.features ?? [];

	}
}

export { Guild };