import type { Client } from '../client/Client';

function handle(client: Client, { session_id }: { session_id: string; }): void {
	client.api.sessionId = session_id;
	setTimeout(() => {
		// TODO: client.user
		/**
		 * Emitted when the client becomes ready to start working
		 * @event Client#ready
		 */
		client.emit('ready');
		client.ready = true;
	}, client.options.intents === 0n ? 1 : 5000).unref();
}

export { handle };