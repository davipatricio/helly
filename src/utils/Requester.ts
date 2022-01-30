import { default as axios, Method, AxiosRequestHeaders } from 'axios';
import { setTimeout as sleep } from 'node:timers/promises';
import type { Client } from '../client/Client';
import { apiVersion, baseApiUrl } from '../constants/gateway';
import Checker from './CheckAPIError';

const Ratelimits: any = {};

class Requester {
	// String types
	token: string;
	// Classes types
	client: Client;
	constructor(token: string, client: Client) {
		this.client = client;
		this.token = token;
	}

	isRatelimited(majorId: string): boolean {
		if (!Ratelimits[majorId]) return false;
		return Ratelimits[majorId].remainingRequests === 0;
	}

	checkRatelimit(majorId: string, headers: any): void {
		const remainingRequests = Number(headers.get('x-ratelimit-remaining') || 5);
		const reset = Math.round(Number(headers.get('x-ratelimit-reset-after') || 0) * 1000) + 250;
		Ratelimits[majorId] = { removing: false, remainingRequests, reset };
		if (remainingRequests === 0) this.applyRatelimit(majorId);
	}

	applyRatelimit(majorId: string) {
		if (Ratelimits[majorId].removing) return;

		Ratelimits[majorId].removing = true;
		setTimeout(() => {
			Ratelimits[majorId] = {};
		}, Ratelimits[majorId].reset).unref();
	}

	_majorId(endpoint: string) {
		// From: https://github.com/discordjs/discord.js/blob/307389a335d0fef25c6e8a3c7e401b1328629bc4/packages/rest/src/lib/RequestManager.ts#L427
		const majorIdMatch = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(endpoint.startsWith('/') ? endpoint : `/${endpoint}`);
		return majorIdMatch?.[1] ?? 'global';
	}

	async _retry(endpoint: string, method: Method, data: any, additionalHeaders: any, majorId: string, _retries: number) {
		this.client.emit('rateLimit', { endpoint, reset: Ratelimits[majorId].reset });
		await sleep(Ratelimits[majorId].reset);
		return this.make(endpoint, method, data, additionalHeaders, _retries + 1);
	}

	make(endpoint: string, method = 'GET' as Method, data = undefined as any, additionalHeaders = {} as any, _retries = 0 as number): Promise<any | Response> {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			if (_retries === 5) return reject('Maximum retries reached');

			let body: any = undefined;
			if (method !== 'GET') body = typeof data === 'object' ? JSON.stringify(data) : data;

			const majorId = this._majorId(endpoint);

			const headers: AxiosRequestHeaders = {
				Authorization: `Bot ${this.token}`,
				'Content-Type': 'application/json',
				'User-Agent': 'DiscordBot (https://github.com/davipatricio/helly/, 1.0.5)',
				...additionalHeaders,
			};

			const isRatelimited = this.isRatelimited(majorId);
			if (isRatelimited) return this._retry(endpoint, method, data, additionalHeaders, majorId, _retries);

			const request = await axios({
				method,
				url: `${baseApiUrl}/v${apiVersion}/${endpoint}`,
				data: body,
				headers,
				timeout: 5000,
			});

			if (!this.isRatelimited(majorId)) this.checkRatelimit(majorId, request.headers);
			if (request.status === 429) return this._retry(endpoint, method, data, additionalHeaders, majorId, _retries);

			console.log(request.data);
			if (request.data.code) Checker.verifyForJSONStatusCode(request.data, `${baseApiUrl}/v${apiVersion}/${endpoint}`, data, method);
			Checker.verifyForStatusCode(`${baseApiUrl}/v${apiVersion}/${endpoint}`, data, request.status, method);
			resolve(request);
		});
	}
}

export { Requester };
