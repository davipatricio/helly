import fetch, { Response } from 'node-fetch';
import { baseApiUrl, apiVersion } from '../constants/gateway.js';
import Checker from './CheckAPIError.js';
import { setTimeout as sleep } from 'node:timers/promises';

import type { Client } from '../client/Client.js';

class Requester {
	token: string;
	client: Client;

	'x-ratelimit-limit': number;
	'x-ratelimit-remaining': number;
	isRatelimited: boolean;
	resetAfter: number;
	constructor(token: string, client: Client) {
		this.client = client;
		this.token = token;

		this.isRatelimited = false;
		this.resetAfter = 1;
	}

	async make(endpoint: string, method = 'GET' as string, data = '' as string | { [key: string]: string }, additionalHeaders = {} as any): Promise<any | Response> {
		const body: string = typeof data === 'object' ? JSON.stringify(data) : data;
		if (this.isRatelimited) {
			this.client.emit('debug', `Client is Ratelimited when making request. Retrying in ${this.resetAfter}.`);
			await sleep(this.resetAfter);
			return this.make(endpoint, method, data, additionalHeaders);
		}

		const headers: any = {
			Authorization: `Bot ${this.token}`,
			'Content-Type': 'application/json',
			'User-Agent': 'DiscordBot (https://github.com/davipatricio/helly/, 1.0.5)',
			...additionalHeaders,
		};

		const request = await fetch(`${baseApiUrl}/v${apiVersion}/${endpoint}`, {
			method,
			headers,
			body,
		});

		this.checkRatelimit(request, this.client);

		if (request.status === 429) {
			this.client.emit('rateLimit', {
				endpoint,
				method,
				data,
			});
			return this.make(endpoint, method, data, additionalHeaders);
		}

		let json: any = null;
		try {
			json = await request.json();
		} catch {
			Checker.verifyForStatusCode(`${baseApiUrl}/v${apiVersion}/${endpoint}`, data, request.status, method);
			return request;
		}
		json ??= {};

		// Verify if an error code was returned from Discord API
		// If there was an error, one of the following methods will throw an error
		if (json.code) Checker.verifyForJSONStatusCode(json, `${baseApiUrl}/v${apiVersion}/${endpoint}`, data, method);
		Checker.verifyForStatusCode(`${baseApiUrl}/v${apiVersion}/${endpoint}`, data, request.status, method);

		return json;
	}

	checkRatelimit(response: Response, client: Client) {
		if (response.headers.get('x-ratelimit-remaining') === null) return;
		this['x-ratelimit-remaining'] = Number(response.headers.get('x-ratelimit-remaining'));

		// If no requests are left, the client is ratelimited
		if (this['x-ratelimit-remaining'] === 0) {
			const resetAfter = Number(response.headers.get('x-ratelimit-reset-after'));

			this.isRatelimited = true;
			this.resetAfter = Number((resetAfter * 1000).toFixed(0)) + 100;

			client.emit('debug', `Rate Limited! Resetting in ${this.resetAfter / 1000} seconds.`);

			setTimeout(() => {
				this.isRatelimited = false;
				this.resetAfter = 1;
			}, this.resetAfter).unref();
		}
	}
}

export { Requester };