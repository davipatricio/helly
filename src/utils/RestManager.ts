/* eslint-disable no-underscore-dangle */
import axios, { AxiosRequestHeaders, AxiosResponse, AxiosResponseHeaders, Method } from 'axios';
import EventEmitter from 'node:events';
import type { Client } from '../client/Client';
import { RestEvents } from '../constants/Events';
import Checker from './CheckAPIError';
import { Ratelimits } from './Ratelimits';

export interface APIRequestEvent {
  url: string;
  endpoint: string;
  headers: Headers;
  retries: number;
  method: Method;
  body?: string;
}

export interface APIResponseEvent {
  url: string;
  endpoint: string;
  headers: AxiosResponseHeaders;
  data: AxiosResponse<any, any>;
  status: number;
}

export type ResponseType = Promise<Record<any, any> | AxiosResponse>;
export type Headers = Record<string, string>;

/** This is a utility class that makes requests to the Discord API easier */
class RestManager extends EventEmitter {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  /** @private */
  #baseHeaders: { Authorization: string; 'Content-Type': string; 'User-Agent': string };
  constructor(client: Client) {
    super();
    this.client = client;
    this.#baseHeaders = {
      Authorization: `Bot ${this.client.token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'DiscordBot (https://github.com/davipatricio/helly/, 1.0.5)',
    };
  }

  /**
   * Makes a request to the Discord API
   * @param endpoint - The endpoint to request
   * @param method - The HTTP method to use, defaults to GET
   * @param data - The data (body) to send with the request. Can be a string or object
   * @param additionalHeaders - The additional headers to send with the request, defaults to {}
   * @example
   * client.rest.make('/channels/1234567891234567', 'POST', { 'id': '1234567891234567' })
   */
  make(endpoint: string, method = 'GET' as Method, data = undefined as any, additionalHeaders = {} as Headers, _retries = 0 as number): ResponseType {
    return new Promise((resolve, reject) => {
      if (_retries === 5) reject(new Error('Maximum retries reached'));

      // eslint-disable-next-line no-param-reassign
      endpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

      const body: string | undefined = method !== 'GET' && typeof data === 'object' ? JSON.stringify(data) : data;
      const majorId = Ratelimits._majorId(endpoint);

      const headers: AxiosRequestHeaders = { ...this.#baseHeaders, ...additionalHeaders };

      const isRatelimited = Ratelimits.isRatelimited(majorId);
      if (isRatelimited) {
        Ratelimits._retry(this.client, endpoint, method, data, additionalHeaders, majorId, _retries);
        return;
      }

      const url = `${this.client.options.rest.api}${endpoint}`;

      this.emit(RestEvents.ApiRequest, { url, endpoint, headers, retries: _retries, method, body: body ?? undefined } as APIRequestEvent);
      axios({
        method,
        url,
        data: body,
        headers,
        timeout: 5000,
      })
        .then(request => {
          this.emit(RestEvents.ApiResponse, { url, endpoint, status: request.status, headers: request.headers, data: request.data } as APIResponseEvent);

          if (!Ratelimits.isRatelimited(majorId)) Ratelimits.checkRatelimit(majorId, request.headers);
          if (request.status === 429) {
            Ratelimits._retry(this.client, endpoint, method, data, additionalHeaders, majorId, _retries);
            return;
          }

          if (request.data?.code) Checker.verifyForJSONStatusCode(request.data, url, data, method);
          Checker.verifyForStatusCode(url, data, request.status, method);
          resolve(request.data);
        })
        .catch(reject);
    });
  }

  override on(event: string | symbol, listener: (...args: any[]) => void): this;
  /** Emitted when the client makes a request to the Discord API */
  override on(event: RestEvents.ApiRequest, listener: (data: APIRequestEvent) => any): this;
  /** Emitted when the client makes a request to the Discord API */
  override on(event: 'ApiRequest', listener: (data: APIRequestEvent) => any): this;
  /** Emitted when the Discord API sends a response to a request */
  override on(event: RestEvents.ApiResponse, listener: (data: APIRequestEvent) => any): this;
  /** Emitted when the Discord API sends a response to a request */
  override on(event: 'ApiResponse', listener: (data: APIRequestEvent) => any): this;
  override on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  override once(event: string | symbol, listener: (...args: any[]) => void): this;
  /** Emitted when the client makes a request to the Discord API */
  override once(event: RestEvents.ApiRequest, listener: (data: APIRequestEvent) => any): this;
  /** Emitted when the client makes a request to the Discord API */
  override once(event: 'ApiRequest', listener: (data: APIRequestEvent) => any): this;
  /** Emitted when the Discord API sends a response to a request */
  override once(event: RestEvents.ApiResponse, listener: (data: APIRequestEvent) => any): this;
  /** Emitted when the Discord API sends a response to a request */
  override once(event: 'ApiResponse', listener: (data: APIRequestEvent) => any): this;
  override once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }
}

export { RestManager };
