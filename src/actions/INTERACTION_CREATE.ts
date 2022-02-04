import type { Client } from '../client/Client';
import { Interaction } from '../structures/BaseInteraction';

function handle(client: Client, interactionData: any): void {
	if (!client.ready) return;
	const interaction = new Interaction(client, interactionData);
	/**
	 * Emitted when an interaction is created
	 * @event Client#interactionCreate
	 * @param {Interaction} interaction The created interaction
	 */
	client.emit('interactionCreate', interaction);

}

export { handle };
