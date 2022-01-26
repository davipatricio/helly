import { Message } from '../structures/Message';
import type { Client } from '../client/Client';
import type { TextChannel } from '../structures/TextChannel';

function handle(client: Client, messageData: any): void {
	if (client.ready) {
		const message = new Message(client, messageData);
		const channel = client._getChannel(messageData.channel_id, messageData.guild_id);

		if (!channel) return;
		if (!channel.isTextBased()) return;
		(channel as TextChannel).messages.cache.set(message.id, message);

		/**
		 * Emitted when a message is sent.
		 * @event Client#messageCreate
		 * @param {Message} message The created message
		 */
		client.emit('messageCreate', message);
	}
}

export { handle };