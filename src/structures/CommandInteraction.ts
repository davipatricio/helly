import type { Client } from '../client/Client';
import { BaseInteraction } from './BaseInteraction';

/**
 * Represents an Chat Input Interaction (Slash Command) on Discord
 * @extends BaseInteraction
 */
class CommandInteraction extends BaseInteraction {
	constructor(client: Client, commandData: any) {
		super(client, commandData);
		this.parseData(commandData);
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
	}

	override _update(data: any): CommandInteraction {
		this.parseData(data);
		return this;
	}
}

export { CommandInteraction };

