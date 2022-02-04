import type { Client } from '../client/Client';
import { DataManager } from './DataManager';

/**
 * Represents an Interaction on Discord
 */
class Interaction extends DataManager {
	constructor(client: Client, userData: any) {
		super(client);
		this.parseData(userData);
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
	}

	_update(data: any): Interaction {
		this.parseData(data);
		return this;
	}
}

export { Interaction };

