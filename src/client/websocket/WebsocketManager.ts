import WebSocket from 'ws';
import type Client from '../Client.js';
import Parser from './Parser.js';
import { apiVersion, apiGatewayUrl } from '../../constants/gateway.js';

class WebsocketManager {
	client: Client;
	connection!: WebSocket;
	constructor(client: Client) {
		this.client = client;
	}

	connect() {
		this.connection = new WebSocket(`${apiGatewayUrl}${apiVersion}&encoding=json`);
		this.connection.on('message', (data: WebSocket.RawData) => Parser.message(this.client, data));
		this.connection.on('close', (code: number) => {
			console.log(code);
		});
	}
}

export default WebsocketManager;
