import fetch from 'node-fetch';
import Endpoints from '../constants/DiscordEndpoints';
import { version } from '../../package.json';
import { verifyForStatusCode, verifyForJSONStatusCode } from './CheckAPIError';

import type Client from '../client/Client';
import type { ClientOptions } from '../client/ClientOptions';
import type { HeadersInit, Response, BodyInit } from 'node-fetch';

class APIRequest {
    token: string;
    options: ClientOptions;
    constructor(token: string, client: Client) {
        this.token = token;
        this.options = client.options;
    }

    async make(endpoint: string, method = 'GET' as string, parseHeaders = true as boolean, data = '' as BodyInit, headers = {} as HeadersInit): Promise<any | Response> {
        let parsedHeaders: HeadersInit = headers;
        if (parseHeaders) {
            parsedHeaders = {
                Authorization: `Bot ${this.token}`,
                'Content-Type': 'application/json',
                'User-Agent': `DiscordBot (https://github.com/davipatricio/helly/, ${version})`,
                ...headers,
            };
        }

        const body: undefined | string | object = typeof data === 'object' ? JSON.stringify(data) : data;
        const fetchData = await fetch(`${Endpoints.apiUrl(this.options.apiVersion!)}${endpoint}`, {
            method,
            headers: parsedHeaders,
            body,
        });

        let json: any = null;
        try {
            json = await fetchData.json();
        } catch {
            verifyForStatusCode(`${Endpoints.apiUrl(this.options.apiVersion!)}${endpoint}`, data, fetchData.status, method);
            return fetchData;
        }
        json ??= {};

        // Verify if an error code was returned from Discord API
        // If there was an error, one of the following methods will throw an error
        if (json.code) verifyForJSONStatusCode(json, `${Endpoints.apiUrl(this.options.apiVersion!)}${endpoint}`, data, method);
        verifyForStatusCode(`${Endpoints.apiUrl(this.options.apiVersion!)}${endpoint}`, data, fetchData.status, method);

        return json;
    }
}

export default APIRequest;
