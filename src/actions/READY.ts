import type { Client } from '../client/Client';

function handle(client: Client, { session_id }: { session_id: string; }) {
	client.api.session_id = session_id;
	setTimeout(() => {
		// TODO: client.user
		client.emit('ready');
		client.ready = true;
	}, client.options.intents === 0 ? 1 : 5000).unref();
}

export { handle };