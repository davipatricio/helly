import type { Client } from '../client/Client';
import { RawCommandTypes, RawInteractionTypes } from '../constants/interactions';
import { CommandInteraction } from '../structures/CommandInteraction';

function handle(client: Client, interactionData: any): void {
	if (!client.ready) return;

	const type = RawInteractionTypes[interactionData.type];

	let interactionClass: CommandInteraction = null;
	if (type === 'APPLICATION_COMMAND') {
		if(RawCommandTypes[interactionData.data.type] === 'CHAT_INPUT') {
			interactionClass = new CommandInteraction(client, interactionData);
		}
	}

	/**
	 * Emitted when an interaction is created
	 * @event Client#interactionCreate
	 * @param {CommandInteraction} interaction The created interaction
	 */
	client.emit('interactionCreate', interactionClass);

}

export { handle };
