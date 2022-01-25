import { FLAGS } from '../constants/permissions';

/**
 * Represents a calculated permissions number
 * @param {string[]} [permissions] The permissions to calculate
 * @see {@link PermissionFlags}
 */
class Permission {
	_: string[];
	static FLAGS: Record<string, number>;
	constructor(permissions: string[]) {
		this._ = permissions ?? [];
	}

	/**
	 * Check if this permission allows a specific permission
	 * @param {string} permission - The name of the permission. [A full list of permission nodes can be found here]{@link Permissions#FLAGS}
	 * @returns {boolean}
	 */
	has(permission: string): boolean {
		return this._.includes(permission);
	}

	/**
	 * Add a permission to the list
	 * @param {string} - The name of the permission. [A full list of permission nodes can be found here]{@link Permissions#FLAGS}
	 */
	add(permission: string) {
		if (!this.has(permission)) this._.push(permission);
	}

	/**
	 * Remove a permission from the list
	 * @param {string} - The name of the permission. [A full list of permission nodes can be found here]{@link Permissions#FLAGS}
	 */
	remove(permission: string): void {
		this._ = this._.filter(p => p !== permission);
	}

	/**
	 * Returns all permissions this instance has
	 * @returns {string[]}
	 */
	toArray(): string[] {
		return this._;
	}

	/**
	 * Returns all permissions this instance has
	 * @returns {string}
	 */
	toString(): string {
		return this._.join(', ');
	}

	parseBitfield(bitfield: number): this {
		if (bitfield & 1 << 0) this.add('CREATE_INSTANT_INVITE');
		if (bitfield & 1 << 1) this.add('KICK_MEMBERS');
		if (bitfield & 1 << 2) this.add('BAN_MEMBERS');
		if (bitfield & 1 << 3) this.add('ADMINISTRATOR');
		if (bitfield & 1 << 4) this.add('MANAGE_CHANNELS');
		if (bitfield & 1 << 5) this.add('MANAGE_GUILD');
		if (bitfield & 1 << 6) this.add('ADD_REACTIONS');
		if (bitfield & 1 << 7) this.add('VIEW_AUDIT_LOG');
		if (bitfield & 1 << 8) this.add('PRIORITY_SPEAKER');
		if (bitfield & 1 << 9) this.add('STREAM');
		if (bitfield & 1 << 10) this.add('VIEW_CHANNEL');
		if (bitfield & 1 << 11) this.add('SEND_MESSAGES');
		if (bitfield & 1 << 12) this.add('SEND_TTS_MESSAGES');
		if (bitfield & 1 << 13) this.add('MANAGE_MESSAGES');
		if (bitfield & 1 << 14) this.add('EMBED_LINKS');
		if (bitfield & 1 << 15) this.add('ATTACH_FILES');
		if (bitfield & 1 << 16) this.add('READ_MESSAGE_HISTORY');
		if (bitfield & 1 << 17) this.add('MENTION_EVERYONE');
		if (bitfield & 1 << 18) this.add('USE_EXTERNAL_EMOJIS');
		if (bitfield & 1 << 19) this.add('VIEW_GUILD_INSIGHTS');
		if (bitfield & 1 << 20) this.add('CONNECT');
		if (bitfield & 1 << 21) this.add('SPEAK');
		if (bitfield & 1 << 22) this.add('MUTE_MEMBERS');
		if (bitfield & 1 << 23) this.add('DEAFEN_MEMBERS');
		if (bitfield & 1 << 24) this.add('MOVE_MEMBERS');
		if (bitfield & 1 << 25) this.add('USE_VAD');
		if (bitfield & 1 << 26) this.add('CHANGE_NICKNAME');
		if (bitfield & 1 << 27) this.add('MANAGE_NICKNAMES');
		if (bitfield & 1 << 28) this.add('MANAGE_ROLES');
		if (bitfield & 1 << 29) this.add('MANAGE_WEBHOOKS');
		if (bitfield & 1 << 30) this.add('MANAGE_EMOJIS_AND_STICKERS');
		if (bitfield & 1 << 31) this.add('USE_APPLICATION_COMMANDS');
		if (bitfield & 1 << 32) this.add('REQUEST_TO_SPEAK');
		if (bitfield & 1 << 33) this.add('MANAGE_EVENTS');
		if (bitfield & 1 << 34) this.add('MANAGE_THREADS');
		if (bitfield & 1 << 35) this.add('CREATE_PUBLIC_THREADS');
		if (bitfield & 1 << 36) this.add('CREATE_PRIVATE_THREADS');
		if (bitfield & 1 << 37) this.add('USE_EXTERNAL_STICKERS');
		if (bitfield & 1 << 38) this.add('SEND_MESSAGES_IN_THREADS');
		if (bitfield & 1 << 39) this.add('START_EMBEDDED_ACTIVITIES');
		if (bitfield & 1 << 40) this.add('MODERATE_MEMBERS');
		return this;
	}
}

Permission.FLAGS = FLAGS;

export { Permission };
