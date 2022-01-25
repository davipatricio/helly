import { PermissionNames, FLAGS } from '../constants/permissions';

/**
 * Represents a calculated permissions number
 * @param {string[]} [permissions] The permissions to calculate
 * @see {@link PermissionFlags}
 */
class Permission {
	_: PermissionNames[];
	static FLAGS: Record<PermissionNames, number>;
	constructor(permissions: PermissionNames[]) {
		this._ = permissions ?? [];
	}

	/**
	 * Check if this permission allows a specific permission
	 * @param {string} permission - The name of the permission. [A full list of permission nodes can be found here]{@link Permissions#FLAGS}
	 * @returns {boolean}
	 */
	has(permission: PermissionNames): boolean {
		return this._.includes(permission);
	}

	/**
	 * Add a permission to the list
	 * @param {string} - The name of the permission. [A full list of permission nodes can be found here]{@link Permissions#FLAGS}
	 */
	add(permission: PermissionNames) {
		if (!this.has(permission)) this._.push(permission);
	}

	/**
	 * Remove a permission from the list
	 * @param {string} - The name of the permission. [A full list of permission nodes can be found here]{@link Permissions#FLAGS}
	 */
	remove(permission: PermissionNames): void {
		this._ = this._.filter(p => p !== permission);
	}

	/**
	 * Returns all permissions this instance has
	 * @returns {string[]}
	 */
	toArray(): PermissionNames[] {
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
		for(const flag in FLAGS) {
			if(FLAGS[flag as PermissionNames] & bitfield) this.add(flag as PermissionNames);
		}
		return this;
	}
}

Permission.FLAGS = FLAGS;

export { Permission };
