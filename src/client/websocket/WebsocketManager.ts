import WebSocket from 'ws';
import { apiGatewayUrl, apiVersion } from '../../constants/gateway';
import type { Client } from '../Client';
import { stop } from './Heartbeater';
import Parser from './Parser';
import { closeCodeMessages } from '../../constants/wsCloseCodes';

const closeCodesAbleToResume = [4000, 4002, 4003];
const closeCodesAbleToReconnect = [4001, 4005, 4007, 4008, 4009];
const closeCodesToThrow = [4004, 4010, 4011, 4012, 4013, 4014];
type CloseCode = keyof typeof closeCodeMessages;

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
			if (typeof code !== 'number') return;
			this._parseClodeCode(code as CloseCode);
		});
	}

	_parseClodeCode(code: CloseCode) {
		if(closeCodesAbleToResume.includes(code)) {
			this.forceReconnect(true);
		}
		if(closeCodesAbleToReconnect.includes(code)) {
			this.client.api.sessionId = null;
			this.forceReconnect(false);
		}
		if(closeCodesToThrow.includes(code)) throw new Error(`DiscordError: ${closeCodeMessages[code]} ${code}`);
		this.client.emit('debug', `[DEBUG] ${closeCodeMessages[code] ?? 'Websocket connection closed with unknown close code. Reconnecting instead of resuming...'}`);
	}

	forceReconnect(resume = true) {
		stop(this.client);
		this.client.api.sessionId = resume ? this.client.api.sessionId : null;

		this.client.reconnect();
		this.client.api.shouldResume = resume;
	}
}

export { WebsocketManager };

