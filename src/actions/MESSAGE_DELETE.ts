import { Message } from '../structures/Message';
import type { Client } from '../client/Client';
import type { TextChannel } from '../structures/TextChannel';

function handle(client: Client, messageData: any): void {
	if (client.ready) {
		const channel = client.channels.cache.get(messageData.channel_id) ?? client.guilds.cache.get(messageData.guild_id)?.channels.cache.get(messageData.channel_id);
		if (!channel) return;
		if (!channel.isTextBased()) return;

		const message = (channel as TextChannel).messages.cache.get(messageData.id)?._clone() ?? new Message(client, messageData);

		/**
		 * Emitted when a message is deleted.
		 * @event Client#messageDelete
		 * @param {Message} message The deleted message
		 */
		client.emit('messageDelete', message);
		(channel as TextChannel).messages.cache.delete(message.id);
	}
}

export { handle };