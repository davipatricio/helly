import type { Client } from '../client/Client';
import { DataManager } from './DataManager';
import { InteractionType, RawInteractionTypes } from '../constants/interactions';

/**
 * Represents an Interaction on Discord
 */
class BaseInteraction extends DataManager {
	// String types
	applicationId!: string;
	id!: string;
	// Class types
	type!: InteractionType;
	constructor(client: Client, interactionData: any) {
		super(client);
		this.parseData(interactionData);
	}

	isCommand() {
		return this.type === 'APPLICATION_COMMAND';
	}

	override parseData(data: any) {
		if (typeof data === 'undefined') return null;
		/**
		 * The ID of the interaction
		 * @type {string}
		 */
		this.id = data.id;
		/**
		 * The ID  of the application this interaction is for
		 * @type {string}
		 */
		this.applicationId = data.application_id;
		/**
		 * The type of interaction
		 * @type {InteractionType}
		 */
		this.type = RawInteractionTypes[data.type];
	}

	_update(data: any): BaseInteraction {
		this.parseData(data);
		return this;
	}
}

export { BaseInteraction };
