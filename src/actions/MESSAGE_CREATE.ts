import { Message } from '../structures/Message';
import type { Client } from '../client/Client';

function handle(client: Client, messageData: any) {
	if (client.ready) {
		const message = new Message(client, messageData);

		/**
		 * Emitted when a message is sent.
		 * @event Client#messageCreate
		 * @param {Message} message The created message
		 */
		client.emit('message', message);
	}
}

export { handle };