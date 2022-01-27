import WebSocket from 'ws';
import { apiGatewayUrl, apiVersion } from '../../constants/gateway';
import type { Client } from '../Client';
import { stop } from './Heartbeater';
import Parser from './Parser';

class WebsocketManager {
	client: Client;
	connection!: WebSocket;
	constructor(client: Client) {
		this.client = client;
	}

	connect(): void {
		this.connection = new WebSocket(`${apiGatewayUrl}${apiVersion}&encoding=json`);
		this.connection.on('message', (data: WebSocket.RawData) => Parser.message(this.client, data));

		this.connection.on('close', (code: number) => {
			if (!this.client.options.autoReconnect) return;
			switch (code) {
			case 4000:
				this.client.emit('debug', '[DEBUG] Unknown websocket error! Resuming...');
				this.forceReconnect();
				break;
			case 4001:
				this.client.emit('debug', '[DEBUG] We have sent an unknwon or invalid opcode to Discord. Reconnecting...');
				this.forceReconnect(false);
				break;
			case 4002:
				this.client.emit('debug', '[DEBUG] We have sent an invalid payload to Discord. Reconnecting...');
				this.forceReconnect();
				break;
			case 4003:
				this.client.emit('debug', '[DEBUG] We have sent a payload to Discord before connecting. Resuming...');
				this.forceReconnect();
				break;
			case 4004:
				this.client.emit('debug', '[DEBUG] The provided account token is incorrect, NOT attempting to reconnect.');
				throw new Error('DiscordError: Invalid token');
			case 4005:
				this.client.emit('debug', '[DEBUG] We have tried to send more than one identify payload. Reconnecting...');
				this.forceReconnect(false);
				break;
			case 4007:
				this.client.emit('debug', '[DEBUG] We have provided an invalid sequence to Discord. Reconnect...');
				this.forceReconnect(false);
				break;
			case 4008:
				this.client.emit('debug', '[DEBUG] Unexpected Rate Limit! Reconnecting in 3 seconds...');
				setTimeout(() => this.forceReconnect(false), 3000).unref();
				break;
			case 4009:
				this.client.emit('debug', '[DEBUG] The bot session timed out. Reconnecting and starting a new one.');
				this.forceReconnect(false);
				break;
			case 4010:
				this.client.emit('debug', '[DEBUG] You have provided invalid sharding data, NOT attempting to reconnect.');
				throw new Error('DiscordError: Invalid shard');
			case 4011:
				this.client.emit('debug', '[DEBUG] The session would have handled too many guilds - you are required to shard your connection in order to connect.');
				throw new Error('DiscordError: 	Sharding required');
			case 4012:
				this.client.emit('debug', '[DEBUG] You have provided an invalid API versiion, NOT attempting to reconnect.');
				throw new Error('DiscordError: Invalid API version');
			case 4013:
				this.client.emit('debug', '[DEBUG] Invalid intents provided, NOT attempting to reconnect.');
				throw new Error('DiscordError: Invalid intent(s)');
			case 4014:
				this.client.emit('debug', '[DEBUG] You sent a disallowed intent for a Gateway Intent, NOT attempting to reconnect.');
				throw new Error('DiscordError: Disallowed intent(s)');
			default:
				this.forceReconnect(false);
				break;
			}
		});
	}

	forceReconnect(resume = true) {
		stop(this.client);
		this.client.api.sessionId = resume ? this.client.api.sessionId : null;

		this.client.reconnect();
		this.client.api.shouldResume = resume;
	}
}

export { WebsocketManager };

