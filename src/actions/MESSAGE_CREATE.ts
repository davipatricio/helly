import { Message } from '../structures/Message';

import type { Client } from '../client/Client';

function handle(client: Client, messageData: any) {
	if (client.ready) {
		const message = new Message(client, messageData);
		client.emit('message', message);
	}
}

export { handle };