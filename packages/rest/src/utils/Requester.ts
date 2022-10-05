import { RateLimit, RateLimitManager } from '@sapphire/ratelimits';
import { RouteBases } from 'discord-api-types/v10';
import { setTimeout as sleep } from 'timers/promises';
import { request } from 'undici';
import type { DispatchOptions } from 'undici/types/agent';
import type { HttpMethod, ResponseData } from 'undici/types/dispatcher';

/**
 * The options for {@link RequesterOptions#routes}
 */
export interface Routes {
  api: string;
  cdn: string;
  gift: string;
  invite: string;
  scheduledEvent: string;
  template: string;
}

/**
 * The options for the requester
 */
export interface RequesterOptions {
  /**
   * The token to use for requests
   */
  authorization: string;
  /**
   * Which type of token is being used
   * @defaultValue `Bot`
   */
  authorizationPrefix: 'Bearer' | 'Bot';
  /**
   * Optional custom routes to use
   */
  routes: Partial<Routes>;
}

const DEFAULT_REQUESTER_OPTIONS = {
  authorization: '',
  authorizationPrefix: 'Bot',
  routes: {
    api: RouteBases.api,
    cdn: RouteBases.cdn,
    gift: RouteBases.gift,
    invite: RouteBases.invite,
    scheduledEvent: RouteBases.scheduledEvent,
  },
} as RequesterOptions;

/**
 * A class that makes requests to the Discord API
 */
export class Requester {
  /**
   * The requester options
   */
  options: RequesterOptions;
  /**
   * A manager that stores and controls information about the rate limits
   */
  ratelimitManager: RateLimitManager;
  /**
   * Creates a new Requester instance
   * @param options Optional requester options
   * @example
   * ```js
   * const { Requester } = require('@hellyjs/rest');
   * const requester = new Requester({ authorization: 'token' });
   * ```
   */
  constructor(options?: Partial<RequesterOptions>) {
    this.#checkOptions(options);
    this.ratelimitManager = new RateLimitManager(5000);
  }

  #checkOptions(options?: Partial<RequesterOptions>) {
    this.options = { ...DEFAULT_REQUESTER_OPTIONS, ...options };

    if (this.options.authorization === '') {
      throw new Error('No authorization token provided');
    }

    if (!['Bot', 'Bearer'].includes(this.options.authorizationPrefix)) {
      throw new Error('Invalid authorization prefix');
    }
  }

  // https://github.com/discordjs/discord.js/blob/d9137c36580b0fd52ad1af99324fb1026b8752d9/packages/rest/src/lib/RequestManager.ts#L495
  #getMajorParameter(endpoint: `/${string}`): string | 'global' {
    const majorIdMatch = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(endpoint);

    // Get the major id for this route - global otherwise
    const majorId = majorIdMatch?.[1] ?? 'global';
    return majorId;
  }

  /**
   * Makes a request to the Discord API
   * @param endpoint The endpoint to make the request to
   * @param method The method to use. Defaults to 'GET'
   * @param body The body to send
   * @param additionalHeaders Additional headers to send with the request
   * @returns The response from the API
   * @example
   * ```js
   * request('/channels/123456789123456789', 'POST', { name: 'new name' })
   * ```
   */
  request(endpoint: `/${string}`, method: HttpMethod = 'GET', body: DispatchOptions['body'] = undefined, additionalHeaders = {} as Record<string, string>) {
    const majorParam = this.#getMajorParameter(endpoint);

    const ratelimit = this.ratelimitManager.acquire(majorParam);
    // TODO: rateLimited event
    if (ratelimit.limited) {
      console.log(`Rate limited for ${majorParam} for ${ratelimit.remainingTime}ms`);
      // Queue the request
      return this.#retry(ratelimit, endpoint, method, body, additionalHeaders);
    }

    ratelimit.consume();
    console.log(`NOT Rate limited for ${majorParam}!`);

    return this.#tryToRequest(ratelimit, endpoint, method, body, additionalHeaders);
  }

  async #retry(ratelimit: RateLimit, endpoint: `/${string}`, method: HttpMethod = 'GET', body: DispatchOptions['body'] = undefined, additionalHeaders = {} as Record<string, string>) {
    let success: ResponseData | boolean = false;
    // Try to do the request 5 times
    for await (const _ of Array(5)) {
      console.log(`Retrying request for ${endpoint}`);
      // Wait for the remaining time
      await sleep(ratelimit.remainingTime);

      // Try to do the request
      const data = await this.#tryToRequest(ratelimit, endpoint, method, body, additionalHeaders, true);
      if (data.success) {
        console.log(`Successfully retried request for ${endpoint}`);
        success = data.response;
        break;
      }
    }

    if (!success) {
      console.log(`Could not retry request for ${endpoint}`);
      throw new Error('Failed to do request after 5 retries');
    }

    return success;
  }

  async #tryToRequest(
    ratelimit: RateLimit,
    endpoint: `/${string}`,
    method: HttpMethod = 'GET',
    body: DispatchOptions['body'] = undefined,
    additionalHeaders = {} as Record<string, string>,
    isRetry = false,
  ): Promise<{ response: ResponseData; success: boolean }> {
    const url = `${this.options.routes.api ?? RouteBases.api}${endpoint}`;
    const headers = {
      Authorization: `${this.options.authorizationPrefix} ${this.options.authorization}`,
      'User-Agent': 'DiscordBot (https://github.com/davipatricio/helly, v0.0.1)',
      ...additionalHeaders,
    };

    const response = await request(url, { body, headers, method });
    if (response.statusCode >= 500 && response.statusCode < 600) {
      // Retry the request. It will throw an error if it fails 5 times
      if (!isRetry) await this.#retry(ratelimit, endpoint, method, body, additionalHeaders);
      return { response, success: false };
    }

    return { response, success: true };
  }
}
