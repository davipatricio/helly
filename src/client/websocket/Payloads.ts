import type { Client } from '../Client';

function sendIdentify(client: Client) {
	const IdentifyPayload: any = {
		op: 2,
		d: {
			large_threshold: 50,
			compress: false,
			shards: [client.options.shardId, client.options.shardCount],
			token: client.token,
			intents: client.options.intents,
			properties: {
				'$os': process.platform,
				'$browser': 'helly',
				'$device': 'helly',
			},
		},
	};

	client.ws.connection?.send(JSON.stringify(IdentifyPayload));
}

function sendResume(client: Client) {
	const ResumePayload = {
		op: 6,
		d: {
			token: client.token,
			session_id: client.api.session_id,
			seq: client.api.sequence,
		},
	};

	client.ws.connection?.send(JSON.stringify(ResumePayload));
}

export {
	sendIdentify,
	sendResume,
};
